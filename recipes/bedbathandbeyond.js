/**
  maybe bed bath and beyond.
  i dont know, i dont know if we'll have enough time.
*/

exports.conf =
  {
    "root": "http://www.bedbathandbeyond.com/",
    "next": {
      "select" : ".menuList > ul a",
      "next": {
        "select": ".prodName a",
        "next" : {
          "stash": {
            "namespace": "bedbathandbeyond",
            "extract": {
              "price": "#prodForm .prodPrice"
            }
          }
        }
      }
    }
  };
