/**
  pottery barn
  ** Ignoring variations: just pulling the lowest price possible out of all variations
*/

exports.conf =
  {
    "namespace": "potterybarn",
    "root": "http://www.potterybarn.com/sitemap.html",
    "minimalQueryString": [],
    "next": {
      "select" : "#content a",
      "next": {
        "collect": {
          "selector": ".navLink a"
        },
        "select": ".product-cell > a",
        "next" : {
          "stash": {
            "extract": {
              "price": ["span.price-amount[itemprop=lowPrice]", "span.price-amount[itemprop=price]"],
              "name": "meta[property='og:title']...attr:content",
              "description": "meta[property='twitter:description']...attr:content",
              "image": "meta[property='og:image']...attr:content"
            }
          }
        }
      }
    }
  };
