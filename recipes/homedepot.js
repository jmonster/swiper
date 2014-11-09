exports.conf =
  {
    "namespace": "homedepot",
    "root": "http://www.homedepot.com/site-directory/index.html",
    "minimalQueryString": [],
    "next": {
      "select": "li~ li+ li li a",
      "next": {
        "select": "a.item_description",
        "collect": {
          "selector": ".icon-next"
        },
        "next": {
          "stash": {
            "extract": {
              "price": "span[itemprop=price]#ajaxPrice",
              "name": "meta[property='og:title']...attr:content",
              "description": "meta[name=description]...attr:content",
              "image": "meta[property='og:image']...attr:content",
              "sku": "span[itemprop=sku]",
              "model": "h2.modelNo"
            }
          }
        }
      }
    }
  }
