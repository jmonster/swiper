exports.conf = 
  {
    "root":"http://www.newegg.com/Info/SiteMap.aspx",
    "next":{
      "select":"li .nolone",
      "next":{
        "collect": {
          "selector":"#categoryNavBtm .noline",
          "transform":{
            "regex":"true,'(.+)\\',",
            "decodeURIComponent":true,
            "query":"Pagesize=100"
          }
        },
        "select":"a.itemImage",
        "next":{
          "stash":{
            "namespace":"newegg",
            "extract":{
              "price":"#singleFinalPrice"
            }
          }
        }
      }
    }
  }
;
