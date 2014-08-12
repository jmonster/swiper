#!/usr/bin/env node

console.time('swiping');

require('benny-hanes-socket-pool'); // voted best LOC of 2012

var cheerio = require('cheerio');
var URL     = require('url');
var async   = require('async');
var slug    = require ('slug');
var colors  = require('colors');
var fs      = require('fs');
var Path    = require('path');
var cheerio = require('cheerio');
var _       = require('lodash');
var argv    = require('./params');

var MICRO_COFACTOR = 1000000;


var recipe  = require('./recipes/'+argv['recipe']+'.js').conf;
var Request = require('request').defaults({
  'headers':{
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language':'en-US,en;q=0.8,es;q=0.6',
    'User-Agent':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
});


var root   = recipe.root;
var next   = recipe.next;
var memo   = {};
var resume = true;


var q =
  async.queue(function (task, callback) {
    step(task.href,task.next,callback);
  }, argv['concurrency']);

q.drain = function() {
  console.log('swiping completed'.blue);
  console.timeEnd('swiping');
}


// dumps the recipe to STDOUT
function printIntro() {
  console.log('Swiper, no swiping!'.green.bold);
  console.log(JSON.stringify(recipe,null,2).yellow+'\r\n');  
}

function alreadyStashed(url) {
  // avoid files persisted to fs
  var slugged   = slug(url).substring(0,249);
  var namespace = argv['recipe'];
  var base      = argv['catalog-path'];
  var path      = Path.join(base,namespace);

  return fs.existsSync(Path.join(path,slugged+".html"));
}

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

  // filesystem store
  if (argv.db === 'fs')   { stasher = require('./lib/stash/fs'); }
  if (argv.db === 'http') { stasher = require('./lib/stash/http'); }

  stasher(stash,url,blob,cb);
}

function step(url,next,CB) {
  // don't visit the same place twice
  if (memo[url]) { return CB(); }
  if (resume && alreadyStashed(url)) { return CB(); }

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
}

printIntro();
q.unshift({href:root,next:next});
