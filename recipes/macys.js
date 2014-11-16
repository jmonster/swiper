/**
  macy's
*/

exports.conf =
  {
    "namespace": "macys",
    "root": "http://www1.macys.com/cms/slp/2/Site-Index",
    "minimalQueryString": [ "ID" ],
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
              "price": ["#priceInfo .priceSale", ".standardProdPricingGroup span:first-child"],
              "name": "h1#productTitle",
              "description": "div#longDescription",
              "meta": "meta[itemprop=image]...attr:content",
              "sku": "meta[itemprop=productID]...attr:content"
            }
          }
        }
      }
    }
  };
