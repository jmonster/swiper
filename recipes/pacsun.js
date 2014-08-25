exports.conf =
  {
    "root": "http://www.pacsun.com/",
    "next": {
      "select": "#mainmenu a[href!=\"javascript:void(0)\"]",
      "next": {
        "select": ".refinementcategory a",
        "next": {
          "select": ".name a",
          "collect": {
            "selector": ".current-page + li a"
          },
          "next": {
            "stash": {
              "namespace": "pacsun",
              "extract": {
                "price": [".salesprice", ".standardprice"]
              }
            }
          }
        }
      }
    }
  }