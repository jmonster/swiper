/**
  nomorerack
  todo: pagination is ajax
*/

exports.conf =
  {
    "namespace": "nomorerack",
    "root": "http://www.nomorerack.com/",
    "next": {
      "select" : ".item a",
      "next": {
        "before": resolvePagination,
        "select": ".deal a",
        "next" : {
          "stash": {
            "extract": {
              "price": "span[data-issw-price-value]"
            }
          }
        }
      }
    }
  };



var request = require('../lib/request');
var cheerio = require('cheerio');
var Url     = require('url');
var async   = require('async');

// TODO create a queue

function resolvePagination(response,html,done) {

  var currentUri = response.request.uri;

  // adjust url for the desired AJAX endpoint
  currentUri.pathname = currentUri.pathname.replace('category','category_jxhrq');

  request(Url.format(currentUri), function(error, response, body) {
    if (error) {
      console.error(error);
      return done();
    }

    var $ = cheerio.load(body);
    var totalResults = $('.image').length;

    // TODO push this page into queue to be recursively processed
    // it's absurd, but there does not appear to be any way to detect
    // the total count nor determine.

    // be sure to verify that all recursive calls are appending
    // to the same html page or else.. well, boo.
    //
    // if (totalResults >= 12) {
    //   resolvePagination(response,body,done2);
    // } 

    // add more deals to the page
    // note: body is the same markup as existing deals on the page
    // so we do not need to modify our recipe or anything :)
    $('#content > .deals').append(body);

    done(null,$.html());
  });
}
