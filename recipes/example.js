exports.conf = 
  {
    "root":"http://foo.bar/sitemap/index.jsp",
    "next":{
      "select":".sitemapSubCategory ul h4 a",
      "next":{
        "select":".view-all a",
        "next":{
          "select":".product > h3 + a",
          "next":{
            "stash":{
              "namespace":"example",
              "extract":{
                "price":[".prod_total_price span.now",".prod_total_price"]
              }
            }
          }
        }
      }
    }
  }
;

exports.pre = function(context,done) {
  console.log('FREE CAKE | FREE CAKE | FREE CAKE');
  done();
}

exports.onProduct = function(html,blob,done) {
  // `html` is the raw html page from the pdp request
  // `blob` is a js object based on `stash` from `exports.conf[.extract]`
  // `done` takes (error,blob2) where blob2 should conform to the std format .. i.e. {price:12000, currency: 'USD', ...}
  done(null,blob);
}
