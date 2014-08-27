var Redis = require('./redis');

module.exports = function(scutter,conf) {
  var redis = new Redis();

  var date  = new Date();
  date = date.getUTCDate() + '/' + date.getMonth() + '/' + date.getYear();

  scutter.on('product', function(product) {
    var hash  = 'price-points';
    var field = conf.namespace + ':' + date;
    
    redis.hincrby(hash,field,1);
  });
}
