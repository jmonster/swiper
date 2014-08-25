exports.conf =
  {
    "root": "http://www.worldmarket.com/",
    "next":{
      "select": ".sf-top-level-link",
      "next": {
        "select": ".cgwListHed a",
        "next": {
          "select": ".thumbheader a",
          "collect": {
            "selector": "#nextprodturl"
          },
          "next": {
            "stash": {
              "namespace": "",
              "extract": {
                "price": "#productPricing [itemprop=\"price\"]"
              }
            }
          }
        }
      }
    }
  }