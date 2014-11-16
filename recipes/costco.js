exports.conf =
  {
    "namespace": "costco",
    "root": "http://www.costco.com/SiteMap?storeId=10301&catalogId=10701",
    "minimalQueryString": [],
    "next": {
      "select" : ".subcategory a",
      "next": {
        "select": ".product-tile-image-container a",
        "next" : {
          "stash": {
            "extract": {
              "price": ".your-price .currency",
              "name": "div.product-info h1[itemprop=name]",
              "description": "div.product-detail-tabs p[itemprop=description]",
              "image": "div.gallery_box ul#large_images img[itemprop=image]...attr:src",
              "sku": "div.form-item input[name=storeId]...attr:value"
            }
          }
        }
      }
    }
  };
