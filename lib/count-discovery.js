var Redis = require('./redis');
var redis = new Redis();
var date = new Date().toISOString()

module.exports = CountDiscovery;

function CountDiscovery(scutter,conf) {
  if(!(this instanceof CountDiscovery)) {
    return new CountDiscovery(scutter,conf);
  }

  scutter.on('product', function(product) {
    var hash  = 'product-counts:' + conf.namespace;
    var field = date;
    redis.hincrby(hash,field,1);
  });
}

CountDiscovery.prototype.finish = function() {
  redis.quit();
}
