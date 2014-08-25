exports.conf =
  {
    "namespace": "worldmarket",
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
              "extract": {
                "price": "#productPricing [itemprop=\"price\"]"
              }
            }
          }
        }
      }
    }
  }
