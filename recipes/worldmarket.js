exports.conf =
  {
    "namespace": "worldmarket",
    "root": "http://www.worldmarket.com/ancillary/sitemap.do",
    "minimalQueryString": [],
    "next":{
      "select": "td > a",
      "next": {
        "select": ".thumbheader a",
        "collect": {
          "selector": "#nextprodturl"
        },
        "next": {
          "stash": {
            "extract": {
              "price": "#productPricing [itemprop=\"price\"]",
              "title": "meta[property='og:title']...attr:content",
              "description": "meta[property='og:description']...attr:content",
              "image": "meta[property='og:image']...attr:content",
              "sku": "[itemprop=sku]"
            }
          }
        }
      }
    }
  }
