/**
  kohl's
*/

exports.conf =
  {
    "namespace": "kohls",
    "root": "http://www.kohls.com/feature/sitemapmain.jsp",
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
              "price": [".column_content .sale"]
            }
          }
        }
      }
    }
  };


