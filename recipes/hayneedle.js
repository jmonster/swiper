/**
  hayneedle
  todo: pagination is some wackass javascript bullshit son
*/

exports.conf =
  {
    "root": "http://www.hayneedle.com/site-map.cfm",
    "next": {
      "select": ".marginLeft25px a",
      "next": {
        "select": "a.HN_PRL_GItemL",
        "next": {
          "stash": {
            "namespace": "hayneedle",
            "extract": {
              "price": "[itemprop='price']"
            }
          }
        }
      }
    }
  };
