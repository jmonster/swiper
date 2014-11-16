/**
  target
*/

exports.conf =
  {
    "namespace":"target",
    "root":"http://www.target.com/np/more/-/N-5xsxf#?lnk=fnav_t_spc_3_18",
    "minimalQueryString": [],
    "next":{
      "select":"div.Shopping_Directory .innerCol a",
      "next":{
        "select":".shopLinksFirst a",
        "next":{
          "collect":{
            "selector":".pagination-item.next > a"
          },
          "select":"a.productTitle",
          "next":{
            "stash":{
              "extract":{
                "price":".offerPrice",
                "title": "meta[property='og:title']...attr:content",
                "description": "meta[property='og:description']...attr:content",
                "image": "meta[property='og:image']...attr:content",
                "gtin": "meta[property='og:upc']...attr:content"
              }
            }
          }
        }
      }
    }
  }
;
