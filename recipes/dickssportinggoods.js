exports.conf =
  {
    "namespace": "dickssportinggoods",
    "root": "http://www.dickssportinggoods.com/",
    "next": {
      "select": ".column li a",
      "next": {
        "select": ".cat-image a",
        "next": {
          "select": ".prod-title a",
          "collect": {
            "selector": ".pages a:last-child"
          },
          "next": {
            "stash": {
              "extract": {
                "price": ".op"
              }
            }
          }
        }
      }
    }
  }
