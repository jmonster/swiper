#!/usr/bin/env node

var cheerio = require('cheerio')
  , URL     = require('url')
  , async   = require('async')
  , slug    = require ('slug')
  , colors  = require('colors')
  , fs      = require('fs')
  , Path    = require('path')
  , argv    = require('./params')
  ;

var recipe  = require('./recipes/'+argv.recipe+'.json');
var request = require('request').defaults({
  'headers':{
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language':'en-US,en;q=0.8,es;q=0.6',
    // 'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36'
    'User-Agent':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
});

var http  = require('http')
  , https = require('https')
  ;

var root = recipe.root
  , next = recipe.next
  , memo = {};

var resume = true;

// concurrency limit
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 1024;


var q = async.queue(function (task, callback) {
          step(task.href,task.next,callback)
        }, 4);

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
  var slugged   = slug(url).substring(0,249)
    , namespace = argv.recipe
    , base      = argv['catalog-path']
    , path      = Path.join(base,namespace)
    ;

  return fs.existsSync(Path.join(path,slugged+".html"));
}

// For each `select`, we typically
// return href's to the next step
function select(html, next, iterator, done){
  var $        = cheerio.load(html)
    , selector = next.select
    , hrefs    = $(selector).map(iterator)
    ;

  done(null,hrefs);
}

// Collect means to process additional pages
// using the current `next` scope (rather than next.next)
function collect(html, next, done) {
  if (!next.collect) { return done(null,[]); }

  var $        = cheerio.load(html)
    , collect  = next.collect
    , selector = collect.selector;
    ;

  // find siblings on the current page
  var siblings = $(selector).map(function() {
    var href      = this.attr('href');
    var uri       = URL.resolve(root,href);
    var transform = collect.transform;

    if (transform) {
      if (transform.regex) {
        var regex = new RegExp(transform.regex,'mi');
        var m = uri.match(regex);
        m = m && m[1];
        uri = m || uri;
      }


      if (transform.decodeURIComponent) {
        uri = decodeURIComponent(uri);
      }


      if (transform.query && !uri.match(transform.query)) {
        uri += uri.match(/\?/) ? '&' : '?';
        uri += transform.query;
      }

    }

    return uri
  });

  done(null,siblings);
}

// store the pdp
function stash(url,html,next,cb) {
  if (!next.stash) { return cb(); }

  var stash = next.stash;

  // filesystem store
  if (stash.db === 'fs') {
    var namespace = stash.namespace
      , base      = argv['catalog-path']
      , path      = Path.join(base,namespace)
      , p
      ;

    try { p = fs.mkdirSync(path); }
    catch (err) { /* fuck it Dude, let's go bowling */ }

    var slugged = slug(url).substring(0,249);
    fs.writeFile(Path.join(path,slugged+".html"), html, function(err) {
      if (err) { console.error(err); }
      cb();
    });
  }
}

function step(url,next,CB) {
  // don't visit the same place twice
  if (memo[url]) {
    return CB();
  }

  if (resume && alreadyStashed(url)) { return CB(); }

  // abort bad requests
  if (!url || !next) {
    return CB();
  }

  process.stdout.write(url.grey + '\r');

  // remember this visit
  memo[url] = true;

  request(url, function(error1, response1, html) {
    if (error1) throw error1;

    var select_iterator = function() {
      var resolved;
      try      { resolved = URL.resolve(url, this.attr('href')); }
      catch(e) {
        console.error(e);
        console.error('href:',this.attr('href'))
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
    }

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
    }

    function _stash(cb) {
      stash(url, html, next, cb);
    }
    
    async.parallel([
      _collect,
      _select,
      _stash
    ], function(err,replies) {
      CB();
    });

  });
}

console.time('swiping');
printIntro();
q.unshift({href:root,next:next});
