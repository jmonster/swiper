/**
  west elm
  todo: prices for product variations
*/

exports.conf =
  {
    "namespace": "westelm",
    "root": "http://www.westelm.com/",
    "next": {
      "select": "#topnav-container a",
      "next": {
        "collect": {
          "selector": "a[rel='next']"
        },
        "select": ".product-cell > a",
        "next": {
          "stash": {
            "extract": {
              "price": "[itemprop='price']"
            }
          }
        }
      }
    }
  };


