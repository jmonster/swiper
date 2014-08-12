/**
  Sephora
*/

exports.conf =
  {
    "root": "http://www.sephora.com/",
    "next": {
      "select": ".meganav__sub a",
      "next": {
        "select": ".product-item > a",
        "collect": {
          "selector": ".next a"
        },
        "next": {
          "stash": {
            "namespace" : "sephora",
            "extract" : {
              "price" : ["#primarySkuInfoArea .sale-price .price", "#primarySkuInfoArea .list-price .price"]
            }
          }
        }
      }
    }
  }
