var Request  = require('request').defaults({
  'headers':{ 'User-Agent':'yayuhh/swiper' }
});
var Redis = require('./redis');
var redis = new Redis();
redis.debug_mode = true;
var subscriber = new Redis();
var moment = require('moment');

var ES_ENDPOINT = 'http://74.109.214.217:9200';

var PRICE_POINT_LUA = __dirname + '/analyze-product-prices.lua';
var PRICE_POINT_CHANNEL = 'new-price-point';
var DEAL_THRESHOLD = 0.90;

var fs = require('fs');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
shasum.update(fs.readFileSync(PRICE_POINT_LUA));
var luaSha = shasum.digest('hex');

subscriber.on('message', function(channel, message) {
  try {
    message = JSON.parse(message);
  } catch(e) {
    console.error('Could not parse message: ', e, e.stack);
  }

  switch(channel) {
    case PRICE_POINT_CHANNEL:
      handlePricePoint(message);
      break;
  }
});

function handlePricePoint(message) {
  var pricePointKey = message.pricePointKey;
  var pKey = message.productKey;
  var price = message.price;

  var now = moment().valueOf();
  var yearAgo = moment().subtract(1, 'year').valueOf();
  redis.evalsha(luaSha, 5, pricePointKey, yearAgo, now, DEAL_THRESHOLD, 'swiper-deals', function(error, isDeal) {
    if(error && error.message.indexOf('NOSCRIPT') !== -1) {
      console.info('script not found...attempting to load..');
      redis.script('load', fs.readFileSync(PRICE_POINT_LUA), function(err, res) {
        if(err) {
          return console.error(err);
        }
        handlePricePoint(message);
      });
    } else if(error) {
      return console.error(error);
    }

    if(!isDeal) {
      return;
    }

    Request.get({
      'url':  ES_ENDPOINT + '/commerce/product/' + pKey
    }, function(error,response,body) {
      if (error) {
        console.error('Failed to RETRIEVE product from ',ENDPOINT, ' due to: ', error);
        createDeal({
          title: 'Unknown Deal',
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
    'url':  ES_ENDPOINT + '/commerce/deal',
    'json': deal
  }, function(error,response,body) {
    if (error) {
      return console.error('Failed to CREATE deal due to: ', error);
    }
    console.info(body);
  });
}

subscriber.subscribe(PRICE_POINT_CHANNEL);
