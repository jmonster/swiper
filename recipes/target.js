exports.conf = 
  {
    "root":"http://www.target.com/np/more/-/N-5xsxf",
    "next":{
      "select":".innerCol a",
      "next":{
        "select":".dlpCatLink",
        "next":{
          "collect":{
            "selector":".pagination-item.next > a"
          },
          "select":".tileInfo > .productTitle > a",
          "next":{
            "stash":{
              "namespace":"target",
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