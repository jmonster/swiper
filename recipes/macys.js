/**
  macy's
*/

exports.conf =
  {
    "root": "http://www1.macys.com/cms/slp/2/Site-Index",
    "next": {
      "select": "#sitemap_wrapper a",
      "next": {
        "collect": {
          "selector": ".arrowRight"
        },
        "select": ".productThumbnailLink",
        "next": {
          "stash": {
            "namespace": "macys",
            "extract": {
              "price": ["#priceInfo .priceSale", ".standardProdPricingGroup span:first-child"]
            }
          }
        }
      }
    }
  };
