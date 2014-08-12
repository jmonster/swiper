exports.conf =
  {
    "root": "http://www.sears.com/shc/s/smv_10153_12605",
    "next": {
      "select": "h4 a",
      "next": {
        "select": ".ac",
        "next": {
          "select" : ".cardProdTitle a",
          "collect" : {
            "selector" : "#nextPageResults a"
          },
          "next": {
            "stash": {
              "namespace" : "sears",
              "extract" : {
                "price" : ".product-price h4"
              }
            }
          }
        }
      }
    }
  };
