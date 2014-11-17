exports.conf = 
  {
    "namespace":"example",
    "root":"http://foo.bar/sitemap/index.jsp",
    "next":{
      "select":".sitemapSubCategory ul h4 a",
      "next":{
        "select":".view-all a",
        "next":{
          // `before` lets you specify a callback
          // that enables you to modify the html
          // before it is process by select/collect
          "before":exports.arbitraryCallback,
          "select":".product > h3 + a",
          "next":{
            "stash":{
              "extract":{
                "price":[".prod_total_price span.now",".prod_total_price"], // chooses first match found
                "name": "#product-detail .brand-color , #product-detail .fn", // concatenates results
                "sku": "form#primary-order-form input[name='prod_id']...attr:value", // attempts to retrieve the value attribute
                "description": "#product-overview",
                "image": "#product-imagery img#main-product-image...attr:src" // attempts to retrieve the source attribute
              }
            }
          }
        }
      }
    }
  }
;

// pre
//
// a function that is called at the start of swiping
exports.pre = function(context,done) {
  console.log('FREE CAKE | FREE CAKE | FREE CAKE');
  done();
}

// beforeStash
//
// If implemented, this function is a hook to modify data before it is stashed.
exports.beforeStash = function(html,blob,done) {
  // `html` is the raw html page from the pdp request
  // `blob` is a js object based on `stash` from `exports.conf[.extract]`
  // `done` takes (error,blob2) where blob2 should conform to the std format .. i.e. {price:12000, currency: 'USD', ...}
  done(null,blob);
}

exports.arbitraryCallback = function(response,html,done) {
  var modifiedHtml = html.replace(/h1/g,'h2');
  done(null,modifiedHtml);
}

