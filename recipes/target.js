/**
  target
*/

exports.conf =
  {
    "namespace":"target",
    "root":"http://www.target.com/",
    "next":{
      "select":".leftmenu li > a",
      "next":{
        "select":".leftNavShopLinks a",
        "next":{
          "collect":{
            "selector":".pagination-item.next > a"
          },
          "select":"a.productTitle",
          "next":{
            "stash":{
              "extract":{
                "price":".offerPrice"
              }
            }
          }
        }
      }
    }
  }
;
