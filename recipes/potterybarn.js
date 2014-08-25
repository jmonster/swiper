/**
  pottery barn
  todo: most prices cannot be swiped because of product variations
*/

exports.conf =
  {
    "namespace": "potterybarn",
    "root": "http://www.potterybarn.com/sitemap.html",
    "next": {
      "select" : ".category a",
      "next": {
        "collect": {
          "selector": "#nextPage"
        },
        "select": ".product-cell > a",
        "next" : {
          "stash": {
            "extract": {
              "price": ".price-state .price-amount"
            }
          }
        }
      }
    }
  };
