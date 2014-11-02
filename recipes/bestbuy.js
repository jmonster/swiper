exports.conf = 
  {
    "namespace":"bestbuy",
    "root":"http://www.bestbuy.com/site/sitemap.jsp",
    "minimalQueryString": ['id', 'skuId'],
    "next":{
      "select": "li.productsMenu a",
      "next":{
        "select":".sku-title a",
        "collect":{
          "selector":"div.pagination-section li.pager a"
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
