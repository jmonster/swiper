exports.conf =
  {
    "namespace": "petsmart",
    "root": "http://www.petsmart.com/sitemap",
    "next": {
      "select": ".ws-category-title",
      "next": {
        "collect": {
          "selector": ".ws-product-listing-pagination-list-next-page a"
        },
        "select": ".kor-product-link",
        "next": {
          "stash": {
            "extract": {
              "price": ".ws-sale-price"
            }
          }
        }
      }
    }
  };
