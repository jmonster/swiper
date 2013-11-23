var request = require('request')
  , cheerio = require('cheerio')
  , _       = require('lodash')
  , async   = require('async')
  , URL     = require('url')
  , recipe  = require('./recipes/sample.json')
  ;

var memoize = {}
  , next    = recipe.next
  , root    = recipe.root
  ;

process(root,next);

function process(url,next){
  if (!url || !next) { console.log('DONE'); return; }

  request(url, function(er1,rs2,html) {
    if (er1) throw er1;

    memoize[root] = html;
    var pages = [];

    collect(url,html,next.collect,{},function(er2,siblings){

      console.log('_.keys(siblings).length:',_.keys(siblings).length)

      var tasks = _.keys(siblings).map(function(s) {
        var url  = s
          , html = siblings[s]
          ;

        return function(cb) {
          select(url,html,next.select,cb);
        }
      });

      async.series(tasks,function(er3,results) {
        var hrefs = _.flatten(results);
        console.log('LAP');
        console.log(hrefs);
        next = next.next;
        hrefs.forEach(function(href) {
          process(href,next);
        })
      });
    });

  });
}


function select(url,html,selector,done){
  console.log(selector)
  var $ = cheerio.load(html)
    , hrefs = $(selector).map(function() {
        return URL.resolve(url,this.attr('href'));
      });

  done(null,hrefs);
}


function collect(url,html,selector,memo,done){
  console.log(url)
  memo[url] = html;

  var $        = cheerio.load(html)
    , siblings = _.keys(memo)
    , pages    = _.values(memo)
    ;


  // collect all similar/paginated pages
  var additionalSiblings = $(selector).map(function() {
    return URL.resolve(root,this.attr('href'));
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
      if (memoize[url]) { return null; }
      return function(cb) {
        request(url,function(e,r,b) {
          memoize[url]=b;
          cb(e,{'url':url,'html':b});
        });
      };
    });

    async.parallel(_.filter(requests), function(err,replies) {
      if (err) throw err;

      // recursively follow `collect` pages until no new links are discovered
      var tasks = replies.map(function(obj) {
        return function(cb) { collect(obj.url,obj.html,next.collect,memo,cb); }
      });

      // doing this in parallel risks redundant network requests.
      async.series(tasks, function(err) {
        if (err) throw err;
        done(null,memo);
      });
    });
  }
}
