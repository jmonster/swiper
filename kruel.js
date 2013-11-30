var request = require('request')
  , cheerio = require('cheerio')
  , _       = require('lodash')
  , async   = require('async')
  , URL     = require('url')
  , slug    = require ('slug')
  , recipe  = require('./recipes/newegg.json')
  , colors  = require('colors')
  ;

var http  = require('http')
  , https = require('https')
  ;

// concurrency limit
http.globalAgent.maxSockets = https.globalAgent.maxSockets = 3;

var memoized = {}
  , next     = recipe.next
  , root     = recipe.root
  ;


printIntro();
process(root,next);

function process(url,next){
  console.log('processing'.bold ,url)

  if (!url || !next) {
    return console.log('Process Completed.');
  }

  request(url, function(er1,rs2,html) {
    if (er1) throw er1;
    
    memoized[url] = html;

    if (next.collect) { _collect(); }

    else if (next.select) {
      var iterator = function() {
        var resolved;
        try {
          resolved = URL.resolve(url, this.attr('href'));
        } catch(e) {
          console.log('error with: ',url);
          console.log(e);
        }

        return resolved;
      };
      select(html, next.select, iterator, function(err,hrefs) {
        // hrefs = hrefs.slice(0,2)
        hrefs.forEach(function(href) { process(href, next.next); });
      });
    }

    else if (next.stash) {
      var stash = next.stash;

      // filesystem store
      if (stash.db === 'fs') {
        var fs        = require('fs')
          , Path      = require('path')
          , namespace = stash.namespace
          , base      = stash.path
          , path      = Path.join(base,namespace)
          , p
          ;

        try {
          p = fs.mkdirSync(path);
        } catch (err) { /* fuck it Dude, let's go bowling */ }

        fs.writeFile(Path.join(path,slug(url)+".html"), html, function(err) {
          if (err) console.log(err);
        })
      }
    }
    
    else if (next.parse) {
      var product = {}  
      _.each(next.stash, function(v,k) {
        // TODO replace this example with something dynamic from the recipe (?)
        var iterator = function() {
          return this.text().trim();
        }


        select(html, v, iterator, function(err,repl) { 
          // TODO persist results to DB
          product[k] = repl[0];
        });

        console.dir(product)
      });
    }

    else {
      throw new Error("unexpected circumstance");
    }

    function _collect() {
      var iterator = function() { return URL.resolve(url, this.attr('href')); };

      collect(url, html, next.collect, {}, function(er2, siblings) {
        var tasks = _.map(siblings, function(html, url) {
          return function(cb) { select(html, next.select, iterator, cb); }
        });

        async.parallel(tasks, function(er3, results) {
          // process the next level for each resolved URL

          _.each(_.flatten(results), function(href) {
            process(href, next.next);
          });
        });
      });
    }

  });
}

function select(html, selector, iterator, done){
  var $     = cheerio.load(html)
    , hrefs = $(selector).map(iterator);

  done(null,hrefs);
}

function collect(url, html, collector, memo, done){
  memo[url] = html;

  var $        = cheerio.load(html)
    , siblings = _.keys(memo)
    ;

  // collect all similar/paginated pages
  var selector = collector.selector;
  var additionalSiblings = $(selector).map(function() {
    var href      = this.attr('href');
    var uri       = URL.resolve(root,href);
    var transform = collector.transform;

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

      if (transform.query) {
        uri += uri.match(/\?/) ? '&' : '?';
        uri += transform.query;
      }
    }

    return uri;
  });

  // remove duplicates
  var newPages = _.uniq(_.difference(additionalSiblings,siblings));

  // all siblings collected
  if (!newPages.length) {
    return done(null,memo);
  }

  // additional pages discovered
  else {
    siblings = _.union(additionalSiblings,siblings);

    // create functions to execute requests in parallel
    var requests = newPages.map(function(url) {
      if (memoized[url]) { return null; }
      
      // avoid multiple identical requests
      memoized[url] = true;

      return function(cb) {
        request(url,function(e,r,b) {
          cb(e, {'url':url,'html':b});
        });
      };
    });

    async.parallel(_.filter(requests), function(err,replies) {
      if (err) throw err;

      // recursively follow `collect` pages until no new links are discovered
      // this handles the case where only 1,2,...,n page links are available at a time
      var tasks = replies.map(function(result) {
        return function(cb) { collect(result.url, result.html, collector, memo, cb); }
      });

      // doing this in parallel risks redundant network requests.
      async.series(tasks, function(err) {
        if (err) { throw err; }
        done(null,memo);
      });
    });
  }
}

function printIntro() {
  console.log('Recipe'.green.bold);
  console.log(JSON.stringify(recipe,null,2).yellow+'\r\n');  
}
