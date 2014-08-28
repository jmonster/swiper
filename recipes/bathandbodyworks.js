/**
  Bath and Body Works

  TODO: Product index pagination.
*/

exports.conf =
  {
    "namespace": "bathandbodyworks",
    "root": "http://www.bathandbodyworks.com/",
    "next": {
      "select": ".subsubCat a",
      "next": {
        "select": ".hproduct .thumbnail a.url",
        "next": {
          "stash": {
            "extract": {
              "price": "#product-detail .price"
            }
          }
        }
      }
    }
  }
