/**
  nomorerack
  todo: pagination is ajax
*/

exports.conf =
  {
    "namespace": "nomorerack",
    "root": "http://www.nomorerack.com/",
    "next": {
      "select" : ".item a",
      "next": {
        "select": ".deal a",
        "next" : {
          "stash": {
            "extract": {
              "price": "span[data-issw-price-value]"
            }
          }
        }
      }
    }
  };
