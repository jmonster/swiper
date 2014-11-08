/**
  hayneedle
  todo: pagination is some wackass javascript bullshit son
*/

exports.conf =
  {
    "namespace": "hayneedle",
    "root": "http://www.hayneedle.com/site-map.cfm",
    "next": {
      "select": ".marginLeft25px a",
      "next": {
        "select": "a.HN_PRL_GItemL",
        "next": {
          "stash": {
            "extract": {
              "price": "meta[property='og:price:amount']...attr:content",
              "name": "h1[itemprop=name]",
              "description": "meta[property='og:description']...attr:content",
              "image": "meta[property='og:image']...attr:content",
              "sku": "meta[property='eb:id']...attr:content"
            }
          }
        }
      }
    }
  };
