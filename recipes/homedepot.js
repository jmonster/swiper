exports.conf =
  {
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
              "namespace": "homedepot",
              "extract": {
                "price": "#ajaxPrice"
              }
            }
          }
        }
      }
    }
  }
