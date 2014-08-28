exports.conf = 
  {
    "namespace":"toysrus",
    "root":"http://www.toysrus.com/sitemap/map.jsp",
    "next":{
      "collect":{
        "selector":".pagination a"
      },
      "select":"h2 + div + ul > li > a",
      "next":{
        "collect":{
          "selector":"#pagination .results"
        },
        "select":"#sitemapLinks > div > div a",
        "next":{
          "stash":{
            "extract":{
              "price":"#price"
            }
          }
        }
      }
    }
  }
;
