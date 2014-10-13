require('colors');

var slug    = require('slug');
var argv    = require('../params');
var _       = require('lodash');
var cheerio = require('cheerio');
var fs      = require('fs');
var async   = require('async');
var URL     = require('url');
var Path    = require('path');
var Request = require('./request');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var MICRO_COFACTOR = 1000000;
var SELECTOR_METHOD_SPLIT = '...';

function Scutter(recipe,q) {
  if (!(this instanceof Scutter)) {
    return new Scutter(q);
  }

  EventEmitter.call(this);

  var scutter = this;

  this.recipe = recipe;
  this.conf   = recipe.conf;
  this.root   = this.conf.root;
  this.memo   = {};
  this.resume = true;

  var q = this.q =
    async.queue(function (task, callback) {
      scutter.step(task.href,task.next,callback);
    }, argv['concurrency']);

  q.drain = function() {
    scutter.emit('done');
  }

  return this;
}

util.inherits(Scutter, EventEmitter);


// fetch the provided url
// and relax it
Scutter.prototype.step = function step(url,next,CB) {
  var scutter     = this;
  var root        = this.root;
  var q           = this.q;
  var memo        = this.memo;
  var recipe      = this.recipe;
  var beforeStash = recipe.beforeStash;

  // don't visit the same place twice
  if (memo[url]) { return CB(); }

  // abort bad requests
  if (!url || !next) { return CB(); }

  // TODO suppress this output
  console.log(url.grey);

  // remember this visit
  memo[url] = true;

  Request(url, function(error1, response1, html1) {
    if (error1) {
      scutter.emit('error',error1);
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

        try      { var resolved = URL.resolve(url, el.attr('href')); }
        catch(e) {
          scutter.emit('error',e,{
            'href': el.attr('href'),
            'url': url
          });
        }

        return resolved;
      };

      function _collect(cb) {
        collect(html,next,function(error2,hrefs) {
          if (error2) {
            scutter.emit('error',error2);
          }

          hrefs.forEach(function(href) {
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
        }

        CB();
      });
    }
  });


  // For each `select`, we typically
  // return href's to the next step
  function select(html, next, iterator, done){
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

    var stasher;
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
            blob[key] = _extractValue($, currentVal);

            // try to parse price to determine if we need to move onto next item
            // when a valid price isnt found
            if (key === "price") {
              blob[key] = parsePrice(blob[key])
              if (blob[key] && blob[key] !== NaN) {return false;}
            } else if (blob[key]) {
              return false;
            }
          });
        } else {
          var text = _extractValue($, val);
          blob[key] = (key === "price") ? parsePrice(text) : text;
        }
      });
    }

    function _extractValue($, swiperValue) {
      var split = swiperValue.split(SELECTOR_METHOD_SPLIT);
      var method = split.length == 2 ? split[1] : undefined;
      var selector = split[0];
      var el = $(selector).first();

      var val = undefined;

      // 'form#pdp input['name=prod_id']###attr:value
      if(method && method.indexOf('attr') !== -1) {
        var attribute = method.split(':');
        attribute = attribute.length == 2 ? attribute[1] : undefined;
        val = attribute ? el.attr(attribute) : undefined; 
      } else {
        val = el.text();
      }
      
      return val ? val.replace(/\s+/g, " ").trim() : undefined;
    }

    if (argv.db === 'fs')   { stasher = require('./stash/fs'); }
    if (argv.db === 'http') { stasher = require('./stash/http'); }

    if (beforeStash) {
      beforeStash(html,blob,function(error,blob2) {
        if (error) {
          scutter.emit('error',error);
        }


        scutter.emit('product',blob2);
        stasher(scutter.conf.namespace,url,blob2,cb);
      });
    } else {
      scutter.emit('product',blob);
      stasher(scutter.conf.namespace,url,blob,cb);
    }
  }
};

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
  parsePrice: parsePrice
}

// HELPERS
function parsePrice (price) {
  var priceMatch = price.match(/\d*\.?\d{1,2}/);
  return MICRO_COFACTOR * parseFloat(priceMatch && priceMatch[0]);
}
