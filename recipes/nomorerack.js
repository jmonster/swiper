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

function resolvePagination(response,html,done) {
  
  // adjust uri to reach the AJAX endpoint
  var baseUri = response.request.uri;
  baseUri.pathname = baseUri.pathname.replace('category','category_jxhrq');
  baseUri = Url.format(baseUri);
  
  worker(cheerio.load(html),0);
  function worker($,offset) {
    var nextUri = baseUri + '?offset='+offset+'&sort=best_selling';

    request(nextUri, function(error, response, body) {
      if (error) {
        console.error(error);
        return done();
      }

      var $ = cheerio.load(body);
      var totalResults = $('.image').length;

      // add more deals to the page
      // note: body is the same markup as existing deals on the page
      // so we do not need to modify our recipe or anything :)
      $('#content > .deals').append(body);

      if (totalResults >= 12) {
        worker($,offset+12);
      } else {
        done(null,$.html());
      }
    });
  }
}
