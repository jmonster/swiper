exports.conf =
  {
    "namespace" : "staples",
    "root": "http://www.staples.com/",
    "minimalQueryString": [],
    "next": {
      "select" : "#wrapall li a",
      "next": {
        "select": "#productDetail a.url",
        "collect" : {
          "selector" : ".pageNext a"
        },
        "next": {
          "stash": {
            "extract" : {
              "price" : ".finalPrice i",
              "title": "meta[property='og:title']...attr:content",
              "description": "meta[name='description']...attr:content",
              "image": "meta[property='og:image']...attr:content"
            }
          }
        }
      }
    }
  }
;
