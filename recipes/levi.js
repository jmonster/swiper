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
                "price": [ "#prod_total_top > span.now", ".prod_total_price" ],
                "name": ["meta[property='og:title']...attr:content", ".product_title"],
                "description": ["meta[property='og:description']...attr:content", "meta[name=description]...attr:content", "p.product_description"],
                "image": ["meta[property='og:image']...attr:content", "img#main_product_image...attr:src"]
              }
            }
          }
        }
      }
    }
  }
;
