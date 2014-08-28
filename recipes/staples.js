exports.conf =
  {
    "namespace" : "staples",
    "root": "http://www.staples.com/",
    "next": {
      "select" : ".wrapPrimarySubnav .navLink",
      "next": {
        "select": ".cat_gallery a",
        "next": {
          "select": "#productDetail a.url",
          "collect" : {
            "selector" : ".pageNext a"
          },
          "next": {
            "stash": {
              "extract" : {
                "price" : ".finalPrice i"
              }
            }
          }
        }
      }
    }
  }
;
