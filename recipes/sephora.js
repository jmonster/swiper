/**
  Sephora
*/

exports.conf =
  {
    "namespace" : "sephora",
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
            "extract" : {
              "price" : ["#primarySkuInfoArea .sale-price .price", "#primarySkuInfoArea .list-price .price"]
            }
          }
        }
      }
    }
  }
