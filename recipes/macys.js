/**
  macy's
*/

exports.conf =
  {
    "namespace": "macys",
    "root": "http://www1.macys.com/cms/slp/2/Site-Index",
    "next": {
      "select": "#sitemap_wrapper a",
      "next": {
        "select": ".productThumbnailLink",
        "collect": {
          "selector": ".arrowRight"
        },
        "next": {
          "stash": {
            "extract": {
              "price": ["#priceInfo .priceSale", ".standardProdPricingGroup span:first-child"]
            }
          }
        }
      }
    }
  };
