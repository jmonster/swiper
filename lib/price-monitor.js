var Request  = require('request').defaults({
  'headers':{ 'User-Agent':'yayuhh/swiper' }
});
var Redis = require('./redis');
var redis = new Redis();
redis.debug_mode = true;
var subscriber = new Redis();
var moment = require('moment');

var PRICE_POINT_LUA = __dirname + '/analyze-product-prices.lua';
var PRICE_POINT_CHANNEL = 'new-price-point';
var DEAL_PERCENTAGE = 0.90;

var fs = require('fs');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
shasum.update(fs.readFileSync(PRICE_POINT_LUA));
var luaSha = shasum.digest('hex');

redis.script('exists', luaSha, function(err, res) {
  if(!res[0]) {
    console.log('script doesnt exist...loading script into redis..');
    redis.script('load', fs.readFileSync(PRICE_POINT_LUA), function(err, res) {
      subscriber.subscribe(PRICE_POINT_CHANNEL);
    });
  } else {
    subscriber.subscribe(PRICE_POINT_CHANNEL);
  }
});

subscriber.on('message', function(channel, message) {
  switch(channel) {
    case PRICE_POINT_CHANNEL:
      handlePricePoint(message);
      break;
  }
});

function handlePricePoint(message) {
  message = JSON.parse(message);

  var pricePointKey = message.pricePointKey;
  var pKey = message.productKey;
  var price = message.price;

  var now = moment().valueOf();
  var yearAgo = moment().subtract(1, 'year').valueOf();
  redis.evalsha(luaSha, 5, pricePointKey, yearAgo, now, DEAL_PERCENTAGE, 'swiper-deals', function(error, isDeal) {
    if(error) {
      return console.error(error);
    }

    if(!isDeal) {
      return;
    }

    Request.get({
      'url':  'http://localhost:9200/commerce/product/' + pKey
    }, function(error,response,body) {
      if (error) {
        console.error('Failed to RETRIEVE product from ',ENDPOINT, ' due to: ', error);
        createDeal({
          title: 'What should we call this deal?',
          price: price,
          url: pKey,
          productId: pKey // todo: manually request and scrape web-page to get information?
        });
        return;
      }

      body = JSON.parse(body);
      var product = body._source;
      product.price = price;
      product.productId = pKey;
      createDeal(product);
    });
  });
}

function createDeal(deal) {
  deal.verified = false; 
  Request.post({
    'url':  'http://localhost:9200/commerce/deal',
    'json': deal
  }, function(error,response,body) {
    if (error) {
      return console.error('Failed to CREATE deal due to: ', error);
    }
    console.info(body);
  });
}
