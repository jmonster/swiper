/**
  ulta
  todo: price on pdp is fucking ajax brah
*/

exports.conf =
  {
    "namespace": "ulta",
    "root": "http://www.ulta.com/ulta/common/sitemap.jsp",
    "next": {
      "select": ".secondLevelWrapper a",
      "next": {
        "collect": {
          "selector": ".next-prev a"
        },
        "select": ".prod-title a",
        "next": {
          "stash": {
            "extract": {
              "price": "#skuInfoPrice"
            }
          }
        }
      }
    }
  };
