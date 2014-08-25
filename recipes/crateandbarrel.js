/**
  Crate and Barrel
*/

exports.conf =
  {
    "namespace": "crateandbarrel",
    "root": "http://www.crateandbarrel.com/",
    "next": {
      "select": ".thirdLevelNavUL .category",
      "next": {
        "select": ".productNameLink",
        "next": {
          "stash": {
            "extract": {
              "price": [".familyDescriptionContainer .salePrice", ".familyDescriptionContainer .regPrice"]
            }
          }
        }
      }
    }
  }
