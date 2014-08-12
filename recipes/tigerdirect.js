exports.conf = 
  {
    "root":"http://www.tigerdirect.com/sectors/category/site-directory.asp",
    "next":{
      "select":".mastNav-cat a",
      "next":{
        "collect":{
          "selector":".guidedsearch:contains(See All Products), .innerWrap:nth-child(2) a, :nth-child(3) .filterItem a"
        },
        "select":".product > div > a",
        "next":{
          "stash":{
            "namespace":"tigerdirect",
            "extract":{
              "price":".salePrice"
            }
          }
        }
      }
    }
  }
;
