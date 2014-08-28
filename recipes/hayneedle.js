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
              "price": "[itemprop='price']"
            }
          }
        }
      }
    }
  };
