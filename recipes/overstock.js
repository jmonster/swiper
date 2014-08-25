/**
  overstock.com
  todo: swipe pagination (ajax)
*/

exports.conf =
  {
    "namespace": "overstock",
    "root": "http://www.overstock.com/sitemap",
    "next": {
      "select" : ".bullet3 a",
      "next": {
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
