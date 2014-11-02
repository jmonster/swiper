/**
  maybe bed bath and beyond.
  i dont know, i dont know if we'll have enough time.
*/

exports.conf =
  {
    "namespace": "bedbathandbeyond",
    "root": "http://www.bedbathandbeyond.com/",
    "request": {
      "timeout": 7500
    },
    "next": {
      "select" : ".menuList > ul a",
      "next": {
        "collect":{
          "selector":"#pagTop #pagNum a.redirPage"
        },
        "select": ".prodName a",
        "next" : {
          "stash": {
            "extract": {
              "price": "#prodForm .prodPrice",
              "name": "h1#productTitle",
              "description": "div.productDesc[itemprop=description]",
              "image": "img.productImage.hidden...attr:src"
            }
          }
        }
      }
    }
  };
