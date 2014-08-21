/**
  overstock.com
  todo: swipe pagination (ajax)
*/

exports.conf =
  {
    "root": "http://www.overstock.com/sitemap",
    "next": {
      "select" : ".bullet3 a",
      "next": {
        "select": ".product a",
        "next" : {
          "stash": {
            "namespace": "overstock",
            "extract": {
              "price": ".price_sale .Ovalue"
            }
          }
        }
      }
    }
  };
