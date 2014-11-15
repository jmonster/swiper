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
              "price": ".ws-sale-price",
              "name": ".ws-product-title",
              "description": "meta[name=description]...attr:content",
              "image": "img.ws-product-image...attr:src",
              "sku": "span.ws-product-item-number-value.item-number"
            }
          }
        }
      }
    }
  };
