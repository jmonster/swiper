exports.conf =
  {
    "namespace": "kmart",
    "root": "http://www.kmart.com/shc/s/smv_10151_10104",
    "next": {
      "select": "h4 a",
      "next": {
        "select": ".ac a",
        "next": {
          "select": ".cardProdTitle a",
          "collect": {
            "selector": "#nextPageResults a"
          },
          "next": {
            "stash": {
              "extract": {
                "price": [".product-price h4", ".pricing", ".regPrice"]
              }
            }
          }
        }
      }
    }
  }
