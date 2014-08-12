/**
  Crate and Barrel
*/

exports.conf =
  {
    "root": "http://www.crateandbarrel.com/",
    "next": {
      "select": ".thirdLevelNavUL .category",
      "next": {
        "select": ".productNameLink",
        "next": {
          "stash": {
            "namespace": "crateandbarrel",
            "extract": {
              "price": [".familyDescriptionContainer .salePrice", ".familyDescriptionContainer .regPrice"]
            }
          }
        }
      }
    }
  }
