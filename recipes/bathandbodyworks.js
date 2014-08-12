/**
  Bath and Body Works

  TODO: Product index pagination.
*/

exports.conf =
  {
    "root": "http://www.bathandbodyworks.com/",
    "next": {
      "select": ".subsubCat a",
      "next": {
        "select": ".hproduct .thumbnail a.url",
        "next": {
          "stash": {
            "namespace": "bathandbodyworks",
            "extract": {
              "price": "#product-detail .price"
            }
          }
        }
      }
    }
  }
