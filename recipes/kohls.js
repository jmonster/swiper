/**
  kohl's
*/

exports.conf =
  {
    "namespace": "kohls",
    "root": "http://www.kohls.com/feature/sitemapmain.jsp",
    "minimalQueryString": [],
    "next": {
      "select": "#sitemap-content li a",
      "next": {
        "collect": {
          "selector": "a[rel='next']"
        },
        "select": ".product-info a",
        "next": {
          "stash": {
            "extract": {
              "price": ["div.sale", "meta[property='og:product:price:amount']...attr:content"],
              "currency": "meta[property='og:price:currency']...attr:content",
              "name": "meta[property='og:title']...attr:content",
              "description": "meta[property='og:description']...attr:content",
              "image": "meta[property='og:image']...attr:content"
            }
          }
        }
      }
    }
  };
