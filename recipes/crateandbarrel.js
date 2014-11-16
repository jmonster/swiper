/**
  Crate and Barrel
*/

exports.conf =
  {
    "namespace": "crateandbarrel",
    "root": "http://www.crateandbarrel.com/Site-Index.aspx",
    "minimalQueryString": [],
    "next": {
      "select": "div.width225:nth-child(1) a",
      "next": {
        "select": "ul.SuperCatNav li a, a.productName, a.mT15",
        "next": {
          "select": ".productNameLink",
          "next": {
            "stash": {
              "extract": {
                "price": "meta[property='og:price:amount']...attr:content",
                "currency": "meta[property='og:price:currency']...attr:content",
                "name": "meta[property='og:title']...attr:content",
                "description": "meta[property='og:description']...attr:content",
                "image": "meta[property='og:image']...attr:content"
              }
            }
          }
        }
      }
    }
  }
