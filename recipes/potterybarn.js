/**
  pottery barn
  ** Ignoring variations: just pulling the lowest price possible out of all variations
*/

exports.conf =
  {
    "namespace": "potterybarn",
    "root": "http://www.potterybarn.com/sitemap.html",
    "next": {
      "select" : "#content a",
      "next": {
        "collect": {
          "selector": ".navLink a"
        },
        "select": ".product-cell > a",
        "next" : {
          "stash": {
            "extract": {
              "price": "span.price-amount[itemprop=lowPrice], span.price-amount[itemprop=price]",
              "name": "h1[itemprop=name]",
              "sku": "input#pkey...attr:value",
              "description": "dl.accordion-component > dd.accordion-body.active > div.accordion-contents p:nth-child(1)",
              "image": "img#hero...attr:src"
            }
          }
        }
      }
    }
  };
