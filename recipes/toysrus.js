exports.conf = 
  {
    "namespace":"toysrus",
    "root":"http://www.toysrus.com/sitemap/map.jsp",
    "minimalQueryString": [ "productId" ],
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
              "price": ["meta[property='eb:saleprice']...attr:content", "meta[property='eb:price']...attr:content"],
              "name": "meta[property='og:title']...attr:content",
              "description": ["meta[property='og:description']...attr:content", "meta[name=description]...attr:content"],
              "image": "meta[property='og:image']...attr:content",
              "sku": ["meta[property='eb:id']...attr:content", "...query:productId"],
              "currency": "meta[property='eb:currency']...attr:content"
            }
          }
        }
      }
    }
  }
;
