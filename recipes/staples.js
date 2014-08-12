exports.conf =
  {
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
              "namespace" : "staples",
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
