/**
  crutchfield
*/

exports.conf =
  {
    "namespace": "crutchfield",
    "root": "http://www.crutchfield.com/sitemap.aspx",
    "minimalQueryString": [],
    "next": {
      "select": ".containerSiteMapShop .paddingLeftTwenty a",
      "next": {
        "select": "ul.products li.itemListBlock > a",
        "next": {
          "select": "ul.products li.itemListBlock > a",
          "next": {
            "select": "a.productTitle",
            "collect": {
              "selector": ".listPageNumberingBottom a:last-child"
            },
            "next": {
              "stash": {
                "extract": {
                  "price": ".finalPrice",
                  "name": "meta[name=title]...attr:content",
                  "description": "meta[name=description]...attr:content",
                  "image": "img.productImage...attr:src"
                }
              }
            }
          }
        }
      }
    }
  };
