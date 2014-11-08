exports.conf =
  {
    "namespace": "dickssportinggoods",
    "root": "http://www.dickssportinggoods.com/shop/index.jsp?categoryId=12454793",
    "next": {
      "select": "#clearance li+ li a , #fans li+ li a , #od li+ li a , #golf li+ li a , #apparel li+ li a , #footwear li+ li a , #exercise a , #ts li+ li a",
      "next": {
        "collect": {
          "selector": ".cat-title a"
        },
        "select": ".cat-title a",
        "next": {
          "select": ".prod-title a",
          "collect": {
            "selector": ".pages a:last-child"
          },
          "next": {
            "stash": {
              "extract": {
                "price": "span[itemprop=price].now",
                "name": ".prod-title",
                "description": "div.prod-short-desc",
                "image": "img.prod-image...attr:src"
              }
            }
          }
        }
      }
    }
  }
