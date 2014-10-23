exports.conf = 
  {
    "namespace":"bestbuy",
    "root":"http://www.bestbuy.com/site/sitemap.jsp",
    "next":{
      "select": ".nav-pro li li a",
      "next":{
        "select":".hproduct .info-main > h3 > a",
        "collect":{
          "selector":".headlink a, #top-padbar .pagination a"
        },
        "next":{
          "stash":{
            "extract":{
              "price":".item-price",
              "name": "div#sku-title > h1",
              "description": "div#long-description",
              "image": "div#postcard-thumbnail img...attr:data-retina-src",
              "sku": "span#sku-value",
              "model": "span#model-value"
            }
          }
        }
      }
    }
  }
;
