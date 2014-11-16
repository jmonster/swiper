/**
  riteaid
*/

exports.conf =
  {
    "namespace": "riteaid",
    "root": "http://shop.riteaid.com/",
    "minimalQueryString": [],
    "next": {
      "select" : "#left-navi a",
      "next": {
        "select": ".product-name a",
        "collect": {
          "selector": ".next-btn a"
        },
        "next": {
          "stash": {
            "extract": {
              "price": "span[itemprop=price]",
              "name": "span[itemprop=name]",
              "description": "meta[name=description]...attr:content",
              "image": "img[itemprop=image]...attr:src",
              "sku": "meta[itemprop=sku]...attr:content"
            }
          }
        }
      }
    }
  };
