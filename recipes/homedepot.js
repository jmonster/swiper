exports.conf =
  {
    "namespace": "homedepot",
    "root": "http://www.homedepot.com/",
    "next": {
      "select": ".L1",
      "next": {
        "select": ".activeLevel a",
        "next": {
          "select": ".item_description",
          "collect": {
            "selector": ".icon-next"
          },
          "next": {
            "stash": {
              "extract": {
                "price": "#ajaxPrice"
              }
            }
          }
        }
      }
    }
  }
