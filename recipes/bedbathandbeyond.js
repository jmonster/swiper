/**
  maybe bed bath and beyond.
  i dont know, i dont know if we'll have enough time.
*/

exports.conf =
  {
    "namespace": "bedbathandbeyond",
    "root": "http://www.bedbathandbeyond.com/",
    "next": {
      "select" : ".menuList > ul a",
      "next": {
      "collect":{
          "selector":"#pagNum a"
        },
        "select": ".prodName a",
        "next" : {
          "stash": {
            "extract": {
              "price": "#prodForm .prodPrice"
            }
          }
        }
      }
    }
  };
