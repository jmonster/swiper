/**
  crutchfield
*/

exports.conf =
  {
    "root": "http://www.crutchfield.com/app/sitemap.aspx",
    "next": {
      "select": ".containerSiteMapShop .marginTopFifteen:nth-child(1) a",
      "next": {
        "select": ".itemListBlock h5 a",
        "next": {
          "select": ".itemListBlock h5 a",
          "next": {
            "collect": {
              "selector": ".listPageNumberingBottom a:last-child"
            },
            "select": ".productTitle",
            "next": {
              "stash": {
                "namespace": "crutchfield",
                "extract": {
                  "price": ".finalPrice"
                }
              }
            }
          }
        }
      }
    }
  };
