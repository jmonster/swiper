require('colors');

var slug    = require('slug');
var argv    = require('../params');
var _       = require('lodash');
var cheerio = require('cheerio');
var fs      = require('fs');
var async   = require('async');
var URL     = require('url');
var querystring = require('querystring');
var Path    = require('path');
var Request = require('./request');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var MICRO_COFACTOR = 1000000;
var SELECTOR_METHOD_SPLIT = '...';

// batching is supported if requests are http
var IS_HTTP_DB = argv.db === 'http';

var stasher;
if (argv.db === 'fs')   { stasher = require('./stash/fs'); }
if (argv.db === 'http') { stasher = require('./stash/http'); }

function Scutter(recipe,options) {
  if (!(this instanceof Scutter)) {
    return new Scutter(options);
  }

  EventEmitter.call(this);

  var scutter = this;
  options = options || {};

  this.recipe = recipe;
  this.conf   = recipe.conf;
  this.root   = this.conf.root;
  this.memo   = {};
  this.batch  = [];
  this.resume = true;
  this.isFinished = false;

  this.q = options.q || async.queue(function(task, callback) {
    scutter.step(task.href,task.next,callback);
  }, argv['concurrency']);

  this.isHealthCheck = options.isHealthCheck || false;
  if(this.isHealthCheck) {
    this.healthCheck = {
      recipe: scutter.conf.namespace,
      checkCount: options.checkCount || 5,
      productUrlsFound: 0,
      productsEmitted: 0,
      timeout: options.healthCheckTimeout || 10000,
      isHealthy: true,
      productChecks: {
        successes: [],
        failures: []
      }
    };

    this.on('product', function(blob) {
      if(scutter.healthCheck) {
        var valid = true;
        _.each(blob, function(value) {
          if(!value) valid = false;
          return valid;
        });

        if(valid) {
          scutter.healthCheck.productChecks.successes.push(blob);
        } else {
          scutter.healthCheck.isHealthy = false;
          scutter.healthCheck.productChecks.failures.push(blob);
        }

        scutter.healthCheck.productsEmitted++;
        if(scutter.healthCheck.productsEmitted >= scutter.healthCheck.checkCount) {  
          scutter.stop();
        }
      }
    });

    this.healthCheck.timeoutId = setTimeout(healthCheckTimeout, this.healthCheck.timeout, scutter);
  }

  this.q.drain = _finish(scutter);

  return this;
}

util.inherits(Scutter, EventEmitter);

function _finish(scutter) {
  return function() {
    if(scutter.isFinished) {
      return;
    }
    scutter.isFinished = true;

    if(scutter.isHealthCheck) {
      delete scutter.healthCheck.timeoutId;
      delete scutter.healthCheck.productsEmitted;
      scutter.emit('done', _.cloneDeep(scutter.healthCheck));
      return;
    }

    // if IS_HTTP_DB and batch length is greater than 0, then we have left over blobs to send.
    // the stasher function for http does not use first two variables (look into removing from function,
    // but right now we keep them for consistency between two types of db stashers)
    if(IS_HTTP_DB && scutter.batch.length > 0) {
      stasher(null,null,scutter.batch,function(error, response) {
        scutter.emit('done');
      });
      scutter.batch = [];
    } else {
      scutter.emit('done');
    }
  }
}

// fetch the provided url
// and relax it
Scutter.prototype.step = function step(url,next,CB) {
  var scutter     = this;
  var root        = this.root;
  var q           = this.q;
  var memo        = this.memo;
  var recipe      = this.recipe;
  var beforeStash = recipe.beforeStash;

  // don't care about inline links
  if(url) url = url.split('#')[0];

  // don't visit the same place twice
  if (memo[url]) { return CB(); }

  // abort bad requests
  if (!url || !next) { return CB(); }

  // TODO suppress this output
  console.info(url.grey);

  // remember this visit
  memo[url] = true;

  if(url.indexOf('http') !== 0) {
    console.warn('Invalid URL: '.yellow, url); 
    return CB();
  }

  var requestParams = { url: url, jar: true };
  if(recipe.conf.request) {
    var requestConf = recipe.conf.request;

    if(requestConf.timeout) {
      requestParams.timeout = recipe.conf.request.timeout;
    }

    if(requestConf.useCookies) {
      requestParams.jar = requestConf.useCookies;
    }
  }

  // only visit subset of products during health-check
  if(scutter.isHealthCheck) {  
    if(scutter.isFinished || scutter.healthCheck.productUrlsFound >= scutter.healthCheck.checkCount) {
      return CB(); 
    }

    if(next.stash) { 
      scutter.healthCheck.productUrlsFound++; 

      if(scutter.healthCheck.productUrlsFound >= scutter.healthCheck.checkCount) {
        clearTimeout(scutter.healthCheck.timeoutId);
      }
    }
  }

  Request(requestParams, function(error1, response1, html1) {
    if (error1) {
      scutter.emit('error',error1);
      if(next.stash && scutter.isHealthCheck) {
        scutter.healthCheck.productUrlsFound--;
      }
      return CB();
    }

    // `before` lets you specify a callback
    // that enables you to modify the html
    // before it is process by select/collect
    if (next.before) {
      next.before(response1, html1, function (error2,html2) {
        if (error2) {
          scutter.emit('error',error2);
        }

        processHtml(html2 || html1);
      });
    } else {
      processHtml(html1);
    }

    function processHtml(html) {
      var select_iterator = function() {
        var el = cheerio(this);

        var resolved = undefined;
        try { 
          resolved = URL.resolve(url, el.attr('href')); 
        } catch(e) {
          scutter.emit('error',e,{
            'href': el.attr('href'),
            'url': url
          });
        }

        return resolved || [];
      };

      function _collect(cb) {
        collect(html,next,function(error2,hrefs) {
          if (error2) {
            scutter.emit('error',error2);
          }

          hrefs.forEach(function(href) {
            if(scutter.isFinished || (scutter.isHealthCheck && scutter.healthCheck.productUrlsFound >= scutter.healthCheck.checkCount)) { 
              return;
            }

            q.unshift({
              href:href,
              next:next
            });
          });

          cb();
        });
      };

      function _select(cb) {
        select(html,next,select_iterator,function(error2,hrefs) {
          if (error2) {
            scutter.emit('error',error2);
          }

          hrefs.forEach(function(href) {
            if(scutter.isFinished || (scutter.isHealthCheck && scutter.healthCheck.productUrlsFound >= scutter.healthCheck.checkCount)) { 
              return;
            }

            q.unshift({
              href:href,
              next:next.next
            });
          });

          cb();
        });
      };

      function _stash(cb) {
        stash.call(this,url,html,next,cb);
      };

      async.parallel([
        _collect.bind(scutter),
        _select.bind(scutter),
        _stash.bind(scutter)
      ], function(err,replies) {
        if (err) {
          scutter.emit('error',err);
          if(next.stash && scutter.isHealthCheck) {
            scutter.healthCheck.productUrlsFound--;
          }
        }

        CB();
      });
    }
  });

  // For each `select`, we typically
  // return href's to the next step
  function select(html, next, iterator, done){
    if(!next.select) { return done(null, []); }

    var $        = cheerio.load(html);
    var selector = next.select;
    var hrefs    = $(selector).map(iterator).toArray();

    done(null,hrefs);
  }

  // Collect means to process additional pages
  // using the current `next` scope (rather than next.next)
  function collect(html, next, done) {
    if (!next.collect) { return done(null,[]); }

    var $        = cheerio.load(html);
    var collect  = next.collect;
    var selector = collect.selector;

    // find siblings on the current page
    var siblings = $(selector).map(function() {
      var el = cheerio(this);

      var href      = el.attr('href');
      var uri       = URL.resolve(root,href);
      var transform = collect.transform;

      if (transform) {
        if (transform.regex) {
          var regex = new RegExp(transform.regex,'mi');
          var m = uri.match(regex);

          uri = (m && m[1]) || uri;
        }


        if (transform.decodeURIComponent) {
          uri = decodeURIComponent(uri);
        }


        if (transform.query && !uri.match(transform.query)) {
          uri += (uri.match(/\?/) ? '&' : '?') + transform.query;
        }
      }

      return uri;
    }).toArray();

    done(null,siblings);
  }

  // store the pdp
  function stash(url,html,next,cb) {
    if (!next.stash) { return cb(); }

    var scutter = this;
    var stash = next.stash;
    url = normalizeUrl(url, scutter.conf.minimalQueryString);

    var blob = html;

    if (stash.extract) {
      var $ = cheerio.load(html);
      blob = {
        currency: 'USD', // hardcoded for this milestone
        url: url,
        seller: scutter.conf.namespace
      };

      _.each(stash.extract, function(val,key) {
        if (val instanceof Array) {
          _.each(val, function(currentVal) {
            // try to parse price to determine if we need to move onto next item
            // when a valid price isnt found

            blob[key] = _extractValue($, currentVal, key);
            if (key === "price") {
              if (blob[key] && blob[key] !== NaN) {return false;}
            } else if (blob[key]) {
              return false;
            }
          });
        } else {
          blob[key] = _extractValue($, val, key);
        }
      });
    }

    function _extractValue($, swiperValue, key) {
      var split = swiperValue.split(SELECTOR_METHOD_SPLIT);
      var method = split.length == 2 ? split[1] : null;
      var selector = split[0];
      var el = $(selector).first();

      var val = undefined;

      // 'form#pdp input['name=prod_id']###attr:value
      if(method && method.indexOf('attr') !== -1) {
        var attribute = method.split(':');
        attribute = attribute.length == 2 ? attribute[1] : null;
        val = attribute ? el.attr(attribute) : null; 
      } else {
        val = el.text();
      }
      
      val = val ? val.replace(/\s+/g, " ").trim() : null;

      if(val) {
        if(key === "price") {
          val = parsePrice(val);
        }

        if(key === "image") {
          // network-path url -- assuming non-secure
          // eg: //s7d9.scene7.com/is/image/BedBathandBeyond/32368842099802p?$83$
          if(val.indexOf('//') === 0) {
            val = 'http:' + val; 
          }

          // remove any potential query string: assuming image shouldnt have them, unless they are modifying size
          // eg: http://s7d9.scene7.com/is/image/BedBathandBeyond/32368842099802p?$83$
          val = val.split('?')[0];
        }
      }

      return val;
    }

    if (beforeStash) {
      beforeStash(html,blob,function(error,blob2) {
        if (error) {
          scutter.emit('error',error);
        }

        dbStore(blob2);
      });
    } else {
      dbStore(blob);
    }

    function dbStore(blob) {
      scutter.emit('product', blob);
      if(scutter.isHealthCheck) return cb();

      if(IS_HTTP_DB) {
        scutter.batch.push(blob);

        if(scutter.batch.length >= argv['batch-size']) {
          stasher(scutter.conf.namespace,url,scutter.batch,cb);
          scutter.batch = [];
        } else {
          cb();
        }
      } else {
        stasher(scutter.conf.namespace,url,blob,cb);
      }
    }
  }
};

Scutter.prototype.stop = function stop() {
  this.q.kill();
  _finish(this)();
}

Scutter.prototype.start = function start() {
  var q    = this.q;
  var root = this.root;
  var conf = this.conf

  // TODO support async pre methods
  if (this.recipe.pre) {
    this.recipe.pre(this, function() {
      q.unshift({
        href:root,
        next:conf.next
      });
    });
  } else {
    q.unshift({
      href:root,
      next:conf.next
    });
  }
};


module.exports = {
  scutter: Scutter,
  parsePrice: parsePrice,
  normalizeUrl: normalizeUrl
}

// HELPERS
function parsePrice (price) {
  if(!price) return null;
  var priceMatch = price.match(/\d*\.?\d{1,2}/);
  return MICRO_COFACTOR * parseFloat(priceMatch && priceMatch[0]);
}

function normalizeUrl(url, minimalQueryString) {
  if(!minimalQueryString) {
    return url;
  }

  var split = url.split('?');
  
  if(split.length == 2) {
    url = split[0];

    var query = querystring.parse(split[1]);
    query = _.pick(query, minimalQueryString);
    
    var keys = _.keys(query).sort();
    if(keys.length) {
      url += '?';
      _.each(keys, function(key) {
        var value = query[key];
        if(_.isArray(value)) {
          value = value.sort();
          _.each(value, function(val) {
            url += key + '=' + val + '&';
          });
        } else {
          url += key + '=' + value + '&';
        }
      });

      url = url.substring(0, url.length-1);
    }
  }

  return url;
}

function healthCheckTimeout(scutter) {
  scutter.healthCheck.isHealthy = false;
  scutter.stop();
}
