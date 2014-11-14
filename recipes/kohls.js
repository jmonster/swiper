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
              "price": "span.price_ammount",
              "name": ".productTitleName",
              "description": "div.Bdescription",
              "image": "div.centerBox div.view_full a...attr:href",
              "sku": "div#product_addToBag input#add_to_bag_product_id...attr:value"
            }
          }
        }
      }
    }
  };


