var request = require('request')
  , cheerio = require('cheerio')
  , _       = require('lodash')
  , async   = require('async')
  , URL     = require('url')
  , recipe  = require('./recipes/sample.json')
  ;

var memoize = {};
var next    = recipe;
var root    = recipe.root;

request(root, function(er1,rs2,bd1) {
  if (er1) throw er1;

  memoize[next.root] = bd1;

  next            = next.next;
  var originalUrl = URL.parse(root);
  var $1          = cheerio.load(bd1);
  var siblings    = [root];

  // collect all similar/paginated pages
  $1(next.collect).each(function() {
    siblings.push(URL.resolve(root,this.attr('href')));
  });

  // filter out duplicates
  siblings = _.uniq(siblings);

  // create functions to execute in parallel
  var fctns = siblings.map(function(url) {
    return function(cb) {
      var memoized = memoize[url];
      if (memoized) { cb(null,null,memoized); }
      else          { request(url,function(e,r,b) { cb(e,b); }); }
    }
  });

  async.parallel(fctns, function(err,replies) {
    if (err) throw err;

    replies.forEach(function(repl) {
      // parse next page
      var $ = cheerio.load(repl);

      // TODO recursively follow `collect` pages until no new links are discovered

    })
  })


});
