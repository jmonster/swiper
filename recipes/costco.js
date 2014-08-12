exports.conf =
  {
    "root": "http://www.costco.com/",
    "next": {
      "select" : "#category-navigation-categories a",
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
