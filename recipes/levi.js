exports.conf = 
{
  "namespace":"levi",
  "root":"http://us.levi.com/product/index.jsp?productId=29069446&&fbn=29069446|null|null",
  "next":{
    "stash":{
      "extract":{
        "price": ["div#prod_total_top.prod_total_price span.now", "div#prod_total_top.prod_total_price"]
      }
    }
  }
}


/*
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
                "price": "div#prod_total_top.prod_total_price span.now, .prod_total_price"
              }
            }
          }
        }
      }
    }
  }
;
*/
