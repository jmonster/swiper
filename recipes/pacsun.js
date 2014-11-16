exports.conf =
  {
    "namespace": "pacsun",
    "root": "http://www.pacsun.com/content/site-map.html",
    "minimalQueryString": [],
    "next": {
      "select": "#content a",
      "next": {
        "select": ".name a",
        "collect": {
          "selector": ".current-page + li a"
        },
        "next": {
          "stash": {
            "extract": {
              "price": [".salesprice", ".standardprice"],
              "name": "h2.productname",
              "description": "meta[name=description]...attr:content",
              "image": "div.productdetailcolumn.productimages div#izView img...attr:src"
            }
          }
        }
      }
    }
  }
