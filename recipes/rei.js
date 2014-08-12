exports.conf =
  {
    "root": "http://www.rei.com/",
    "next": {
      "select": ".catList",
      "next": {
        "select": "#sidebarWrapper a",
        "next": {
          "select": ".productDescription a",
          "collect": {
            "selector": ".searchPagination a:last-child"
          },
          "next": {
            "stash": {
              "namespace": "rei",
              "extract": {
                "price": ".price"
              }
            }
          }
        }
      }
    }
  };
