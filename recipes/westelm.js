/**
  west elm
  todo: prices for product variations
*/

exports.conf =
  {
    "namespace": "westelm",
    "root": "http://www.westelm.com/",
    "minimalQueryString": [ "pkey" ],
    "next": {
      "select": "#topnav-container .col a",
      "next": {
        "collect": {
          "selector": "a[rel='next']"
        },
        "select": ".product-cell > a",
        "next": {
          "stash": {
            "extract": {
              "price": ["[itemprop='lowPrice']", "[itemprop='price']"],
              "title": "meta[property='og:title']...attr:content",
              "description": "meta[name='description']...attr:content",
              "image": "meta[property='og:image']...attr:content"
            }
          }
        }
      }
    }
  };


