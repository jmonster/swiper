/**
  Bath and Body Works

  TODO: Product index pagination.
*/

exports.conf =
  {
    "namespace": "bathandbodyworks",
    "root": "http://www.bathandbodyworks.com/",
    "minimalQueryString": [ "productId" ],
    "next": {
      "select": ".subsubCat a",
      "next": {
        "select": ".hproduct .thumbnail a.url",
        "next": {
          "stash": {
            "extract": {
              "price": "#product-detail .price",
              "name": "#product-detail .brand-color , #product-detail .fn",
              "sku": "form#primary-order-form input[name='prod_id']...attr:value",
              "description": "#sdfsdfproduct-overview",
              "image": "#product-imagery img#main-product-image...attr:src"
            }
          }
        }
      }
    }
  }

