exports.conf =
  {
    "namespace": "overstock",
    "root": "http://www.overstock.com/sitemap",
    "next": {
      "select" : ".bullet3 a",
      "next": {
        "before": resolvePagination,
        "collect": {
          "selector":"body > a.swiper.pagination" // relies on resolvePagination -- see below!
        },
        "select": ".product a",
        "next" : {
          "stash": {
            "extract": {
              "price": ".price_sale .Ovalue"
            }
          }
        }
      }
    }
  };


var request = require('./request');
var cheerio = require('cheerio');
var Url     = require('url');

var PER_PAGE = 120; // max supported on overstock


function resolvePagination(response,html,done) {
  var $ = cheerio.load(html,{ decodeEntities: false }); // `&` in querystrings get messed up without decodeEntities:false
  var currentUri = response.request.uri;

  delete currentUri.search; // overrules query!
  currentUri.query = {infinite: true};

  // determine how many "pages" we need to fetch
  request(Url.format(currentUri), function(error, response, body) {
    var blob = JSON.parse(body);
    var totalResults = blob.totalResults;
    var pageCount = totalResults/PER_PAGE;
    var html2 = $('body');

    // create array of URLs
    for (i = 1; pageCount > 1 && i < pageCount; i++) { // skip the first page since it's already processed
      currentUri.query = { infinite: true, index: i*PER_PAGE };
      var uri = Url.format(currentUri);

      // inject those URLs back into the page
      var linkTag = '<a class="swiper pagination" href="'+uri+'"></a>';
      html2.append(linkTag);
    }

    done(null,$.html());
  });
}
