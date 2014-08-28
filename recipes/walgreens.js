/**
  walgreens
*/

exports.conf =
  {
    "root": "http://www.walgreens.com/site_map.jsp",
    "next": {
      "select" : "#shop_content li[class!=first] a",
      "next": {
        "select": "#sidenav .top-level a",
        "next": {
          "collect": {
            "selector": "#pagination a[title='Next Page']"
          },
          "select": ".product-name a",
          "next": {
            "stash": {
              "namespace": "walgreens",
              "extract":{
                "price": ["#sale_amount", "#vpdSinglePrice", "#main [itemprop='price']", "#price_amount"]
              }
            }
          }
        }
      }
    }
  };
