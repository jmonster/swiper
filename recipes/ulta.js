/**
  ulta
  todo: price on pdp is fucking ajax brah
*/

exports.conf =
  {
    "namespace": "ulta",
    "root": "http://www.ulta.com/ulta/common/sitemap.jsp",
    "minimalQueryString": [ "productId" ],
    "next": {
      "select": ".secondLevelWrapper a",
      "next": {
        "collect": {
          "selector": ".next-prev a"
        },
        "select": ".prod-title a",
        "next": {
          "stash": {
            "extract": {
              "price": "meta[property='product:price:amount']...attr:content",
              "currency": "meta[property='product:price:currency']...attr:content",
              "name": "meta[property='og:title']...attr:content",
              "description": "meta[property='og:description']...attr:content",
              "image": "meta[property='og:image']...attr:content",
              "sku": "...query:productId"
            }
          }
        }
      }
    }
  };
