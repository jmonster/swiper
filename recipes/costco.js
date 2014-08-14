exports.conf =
  {
    "root": "http://www.costco.com/SiteMap?storeId=10301&catalogId=10701",
    "next": {
      "select" : ".category a",
      "next": {
        "select": ".category-tile a",
        "next": {
          "select": ".product-tile-image-container a",
          "next" : {
            "stash": {
              "namespace": "costco",
              "extract": {
                "price": ".your-price .currency"
              }
            }
          }
        }
      }
    }
  };
