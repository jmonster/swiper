exports.conf = 
  {
    "namespace":"levi",
    "root":"http://us.levi.com/sitemap/index.jsp",
    "next":{
      "select":".sitemapSubCategory ul h4 a",
      "next":{
        "select":".view-all a",
        "next":{
          "select":".product > h3 + a",
          "next":{
            "stash":{
              "extract":{
                "price":[".prod_total_price span.now",".prod_total_price"]
              }
            }
          }
        }
      }
    }
  }
;
