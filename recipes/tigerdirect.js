exports.conf = 
  {
    "namespace":"tigerdirect",
    "root":"http://www.tigerdirect.com/sectors/category/site-directory.asp",
    "minimalQueryString": [ "EdpNo" ],
    "next":{
      "select":".mastNav-cat a",
      "next":{
        "collect":{
          "selector":"a.paginatNext"
        },
        "select":".product h3.itemName > a",
        "next":{
          "stash":{
            "extract":{
              "price":".salePrice",
              "title": "meta[property='og:title']...attr:content",
              "description": "meta[name='description']...attr:content",
              "image": "meta[property='og:image']...attr:content",
            }
          }
        }
      }
    }
  }
;
