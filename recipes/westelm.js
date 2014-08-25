/**
  west elm
*/

exports.conf =
  {
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
            "namespace": "westelm",
            "extract": {
              "price": "[itemprop='price']"
            }
          }
        }
      }
    }
  };


