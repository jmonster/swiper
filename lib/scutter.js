require('colors');

var slug    = require ('slug');
var argv    = require('../params');
var _       = require('lodash');
var cheerio = require('cheerio');
var fs      = require('fs');
var async   = require('async');
var URL     = require('url');
var Path    = require('path');

var MICRO_COFACTOR = 1000000;

var Request = require('request').defaults({
  'headers':{
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language':'en-US,en;q=0.8,es;q=0.6',
    'User-Agent':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
});

function Scutter(recipe,q) {
  if (!(this instanceof Scutter)) {
    return new Scutter(q);
  }

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

  this.__defineGetter__('drain', function()     { return q.drain;  });
  this.__defineSetter__('drain', function(value){ q.drain = value; });

  return this;
}


// fetch the provided url
// and relax it
Scutter.prototype.step = function step(url,next,CB) {
  var root = this.root;
  var q    = this.q;
  var memo = this.memo;
  var onProduct = this.recipe.onProduct;

  // don't visit the same place twice
  if (memo[url]) { return CB(); }

  // abort bad requests
  if (!url || !next) { return CB(); }

  // TODO suppress this output
  console.log(url.grey);

  // remember this visit
  memo[url] = true;

  Request(url, function(error1, response1, html) {
    if (error1) { throw error1; }

    var select_iterator = function() {
      var el = cheerio(this);

      try      { var resolved = URL.resolve(url, el.attr('href')); }
      catch(e) {
        console.error(e);
        console.error('href:',el.attr('href'));
        console.error('url: ',url);
      }

      return resolved;
    };

    function _collect(cb) {
      collect(html,next,function(error2,hrefs) {

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
      stash(url,html,next,cb);
    };
    
    async.parallel([
      _collect,
      _select,
      _stash
    ], function(err,replies) {
      CB();
    });
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
    var stash = next.stash;

    var stasher;
    var blob = html;

    if (stash.extract) {
      var $ = cheerio.load(html);
      blob = {
        currency: 'USD', // hardcoded for this milestone
        url: url
      };

      _.each(stash.extract, function(val,key) {
        if (val instanceof Array) {
          _.each(val, function(currentVal) {
            blob[key] = $(currentVal).first().text();
            if (blob[key]) return false;
          });
        } else {
          blob[key] = $(val).first().text();
        }

        if (key === "price") {
          var priceMatch = blob[key].match(/(\d*\.\d{2})/);
          blob[key] = priceMatch && priceMatch[1];
          blob[key] = MICRO_COFACTOR * parseInt(blob[key]);
        }
      });
    }

    if (argv.db === 'fs')   { stasher = require('./stash/fs'); }
    if (argv.db === 'http') { stasher = require('./stash/http'); }

    if (onProduct) {
      onProduct(html,blob,function(error,blob2) { stasher(stash,url,blob2,cb); });
    } else {
      stasher(stash,url,blob,cb);
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


module.exports = Scutter;