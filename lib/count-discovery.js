var Redis = require('./redis');
var redis = new Redis();

module.exports = CountDiscovery;

function CountDiscovery(scutter,conf) {
  if(!(this instanceof CountDiscovery)) {
    return new CountDiscovery(scutter,conf);
  }

  var date = new Date().toISOString()

  scutter.on('product', function(product) {
    var hash  = 'price-points';
    var field = conf.namespace + ':' + date;
    
    redis.hincrby(hash,field,1);
  });
}

CountDiscovery.prototype.finish = function() {
  redis.quit();
}
