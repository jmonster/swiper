exports.conf =
  {
    "root": "http://www.sierratradingpost.com/",
    "next": {
      "select": ".deptTitle",
      "next": {
        "select": "h1+ div a",
        "next": {
          "select": ".productTitle a",
          "collect": {
            "selector": ".pages a:last-child"
          },
          "next": {
            "stash": {
              "namespace": "sierratradingpost",
              "extract": {
                "price": "#displayPrice"
              }
            }
          }
        }
      }
    }
  }

