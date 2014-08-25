
/**
  kohl's
*/

exports.conf =
  {
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
            "namespace": "kohls",
            "extract": {
              "price": [".column_content .sale"]
            }
          }
        }
      }
    }
  };


