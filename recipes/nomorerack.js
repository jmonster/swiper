/**
  nomorerack
  todo: pagination is ajax
*/

exports.conf =
  {
    "root": "http://www.nomorerack.com/",
    "next": {
      "select" : ".item a",
      "next": {
        "select": ".deal a",
        "next" : {
          "stash": {
            "namespace": "nomorerack",
            "extract": {
              "price": "span[data-issw-price-value]"
            }
          }
        }
      }
    }
  };
