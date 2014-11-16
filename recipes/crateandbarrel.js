/**
  Crate and Barrel
*/

exports.conf =
  {
    "namespace": "crateandbarrel",
    "root": "http://www.crateandbarrel.com/Site-Index.aspx",
    "minimalQueryString": [],
    "next": {
      "select": "div.width225:nth-child(1) a",
      "next": {
        "select": "ul.SuperCatNav li a, a.productName, a.mT15",
        "next": {
          "select": ".productNameLink",
          "next": {
            "stash": {
              "extract": {
                "price": [".productPriceContainer .salePrice", ".productPriceContainer .regPrice"],
                "name": "#_productTitle",
                "description": "p.productDescriptionShortCopy",
                "image": "div.productImageWrap img...attr:src",
                "sku": "span#_skuNum"
              }
            }
          }
        }
      }
    }
  }
