exports.conf = 
  {
    "namespace":"levi",
    "root":"http://us.levi.com/sitemap/index.jsp",
    "minimalQueryString": [ "productId" ],
    "next":{
      "select":".sitemapSubCategory ul h4 a",
      "next":{
        "select":".view-all a",
        "next":{
          "select":".product > h3 + a",
          "next":{
            "stash":{
              "extract":{
                "price": [ "div#prod_total_top.prod_total_price span.now", ".prod_total_price" ],
                "name": ".product_title",
                "description": "p.product_description",
                "image": "img#main_product_image...attr:src"
              }
            }
          }
        }
      }
    }
  }
;
