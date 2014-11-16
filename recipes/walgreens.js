/**
  walgreens
*/

exports.conf =
  {
    "namespace": "walgreens",
    "root": "http://www.walgreens.com/site_map.jsp",
    "minimalQueryString": [ "ID" ],
    "next": {
      "select" : "#shop_content li+ li a",
      "next": {
        "select": "#sidenav .top-level a",
        "next": {
          "collect": {
            "selector": "#pagination a[title='Next Page']"
          },
          "select": ".product-name a",
          "next": {
            "stash": {
              "extract":{
                "price": ["#sale_amount", "#vpdSinglePrice", "#main [itemprop='price']", "#price_amount"],
                "name": "meta[property='og:title']...attr:content",
                "description": ["meta[property='og:description']...attr:content", "meta[name=description]...attr:content"],
                "image": "meta[property='og:image']...attr:content"
              }
            }
          }
        }
      }
    }
  };
