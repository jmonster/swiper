/**
  riteaid
*/

exports.conf =
  {
    "namespace": "riteaid",
    "root": "http://shop.riteaid.com/",
    "next": {
      "select" : ".linkList > li > a",
      "next": {
        "select": ".linkList > li > a",
        "next": {
          "collect": {
            "selector": ".nextPage a"
          },
          "select": ".title a",
          "next": {
            "stash": {
              "extract": {
                "price": ["dd.salePrice", "dd.price"]
              }
            }
          }
        }
      }
    }
  };
