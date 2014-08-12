exports.conf =
  {
    "root": "http://www.walmart.com/",
    "next": {
      "select": ".boxColumn a",
      "next": {
        "select": ".browseIn",
        "next": {
          "collect": {
            "selector":".btn-nextResults a"
          },
          "select": ".ListItemLink",
          "next" : {
            "stash": {
              "namespace" : "walmart",
              "extract" : {
                "price" : [".priceInfoOOS", "#WM_PRICE .camelPrice", "#PUT_STORE_PRICE span"]
              }
            }
          }
        }
      }
    }
  };
