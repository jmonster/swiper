exports.conf = 
  {
    "root":"http://www.bestbuy.com/site/sitemap.jsp",
    "next":{
      "select":".nav-pro li li a",
      "next":{
        "select":".hproduct .info-main > h3 > a",
        "collect":{
          "selector":".search.cat > li > a, ul.pagination:nth-child(1) > li > a:not(.next)"
        },
        "next":{
          "stash":{
            "namespace":"bestbuy",
            "extract":{
              "price":".item-price"
            }
          }
        }
      }
    }
  }
;
