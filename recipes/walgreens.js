/**
  walgreens
*/

exports.conf =
  {
    "namespace": "walgreens",
    "root": "http://www.walgreens.com/site_map.jsp",
    "next": {
      "select" : "#shop_content li[class!=first] a",
      "next": {
        "select": "#sidenav a",
        "next": {
          "collect": {
            "selector": "#pagination a[title='Next Page']"
          },
          "select": ".product-name a",
          "next": {
            "stash": {
              "extract":{
                "price": ["#sale_amount", "#vpdSinglePrice", "#main [itemprop='price']", , "#price_amount"]
              }
            }
          }
        }
      }
    }
  };
