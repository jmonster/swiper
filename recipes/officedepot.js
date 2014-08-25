/**
  office depot
*/

exports.conf =
  {
    "namespace": "officedepot",
    "root": "http://www.officedepot.com/a/site-map/?cm_sp=FooterLinks-_-SiteInfo-_-SiteMap",
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
                "price": [".price_amount"]
              }
            }
          }
        }
      }
    }
  };
