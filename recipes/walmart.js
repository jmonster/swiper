/**
  Walmart

  TODO: Parse markplace prices which are ajaxed in.
*/

exports.conf =
  {
    "namespace" : "walmart",
    "root": "http://www.walmart.com/",
    "next": {
      "select": '.boxColumn a[class!="mainCategory"]',
      "next": {
        "select": ".browseIn",
        "next": {
          "collect": {
            "selector":".btn-nextResults a"
          },
          "select": ".ListItemLink",
          "next" : {
            "stash": {
              "extract" : {
                "price" : [".priceInfoOOS", ".camelPrice", "#PUT_STORE_PRICE span"]
              }
            }
          }
        }
      }
    }
  };
