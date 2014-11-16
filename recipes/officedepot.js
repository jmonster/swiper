/**
  office depot
*/

exports.conf =
  {
    "namespace": "officedepot",
    "root": "http://www.officedepot.com/a/site-map/?cm_sp=FooterLinks-_-SiteInfo-_-SiteMap",
    "minimalQueryString": [],
    "next": {
      "select": ".sub_list a",
      "next": {
        "select": ".cats a",
        "next": {
          "collect": {
            "selector": ".next a"
          },
          "select": ".descriptionShort a",
          "next": {
            "stash": {
              "extract": {
                "price": [".price_amount"],
                "name": "span[itemprop=name]",
                "description": "meta[name=description]...attr:content",
                "image": "meta[property='og:image']...attr:content",
                "sku": "span[itemprop=sku]"
              }
            }
          }
        }
      }
    }
  };
