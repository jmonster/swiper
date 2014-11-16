exports.conf =
  {
    "namespace": "sears",
    "root": "http://www.sears.com/shc/s/smv_10153_12605",
    "minimalQueryString": [],
    "next": {
      "select": "h4 a",
      "next": {
        "select": ".ac",
        "next": {
          "select": ".cardProdTitle a",
          "collect": {
            "selector" : "#nextPageResults a"
          },
          "next": {
            "stash": {
              "extract": {
                "price": [".salePrice", "[itemprop=price]", ".product-price h4"],
                "name": "h1[itemprop=name]",
                "description": "meta[name=description]...attr:content",
                "image": "div[data-id=product-image-main] > img...attr:src",
                "sku": "small[itemprop=productID]"
              }
            }
          }
        }
      }
    }
  };
