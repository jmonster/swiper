/*
 * sometimes they nest two-three categories deep, need to find out how to handle that. currently just pcik up products if they exist at 1st cat level
 */

exports.conf =
  {
    "namespace": "dickssportinggoods",
    "root": "http://www.dickssportinggoods.com/shop/index.jsp?categoryId=12454793",
    "next": {
      "select": "#clearance li+ li a , #fans li+ li a , #od li+ li a , #golf li+ li a , #apparel li+ li a , #footwear li+ li a , #exercise a , #ts li+ li a",
      "next": {
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
