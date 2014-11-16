exports.conf =
  {
    "namespace": "sierratradingpost",
    "root": "http://www.sierratradingpost.com/",
    "minimalQueryString": [],
    "next": {
      "select": ".subDeptLinks li a",
      "next": {
        "select": ".productTitle a",
        "collect": {
          "selector": ".pages a:last-child"
        },
        "next": {
          "stash": {
            "extract": {
              "price": "#displayPrice",
              "name": "meta[name='og:title']...attr:content",
              "description": "meta[name='og:description']...attr:content",
              "image": "meta[name='og:image']...attr:content"
            }
          }
        }
      }
    }
  }

