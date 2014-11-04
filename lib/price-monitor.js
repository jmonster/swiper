var Request  = require('request').defaults({
  'headers':{ 'User-Agent':'yayuhh/swiper' }
});
var Redis = require('./redis');
var redis = new Redis();
redis.debug_mode = true;
var subscriber = new Redis();
var moment = require('moment');
var argv = require('../params.js');
var url = require('url');

var ES_ENDPOINT = argv['es-endpoint'];

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

var PopsModels = require('pops-models');
var db = new PopsModels({
  mongoUrl: argv['mongo-endpoint'],
  esUrl: argv['es-endpoint']
});
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

    // add deal id to merchant list
    var host = undefined;
    try {
      host = url.parse(deal.url).hostname;
      var wwwIndex = host.indexOf('www.');
      if(wwwIndex !== -1) host = host.substring(0, wwwIndex) + host.substring(wwwIndex + 'www.'.length); // strip www if it exists for comparison
    } catch(e) {
      console.error('failed to parse url: ', e);
    }

    if(host) {
      db.Merchant.findOne( { homepage_url: { $regex: host } }, function(err, merchant) {
        if(err) {
          return console.error('failed to find merchant to associate deal with: ', err);
        }

        if(!merchant) {
          return console.warn('could not find merchant associated with deal hostname: ' + host + '\ndeal url: ' + deal.url);
        }

        if(!merchant.list) {
          return console.warn('merchant does not have list associated with them: ', JSON.stringify(merchant));
        }

        db.List.update({_id: merchant.list}, {$push: { deals: body._id }}, function(err, result) {
          if(err) {
            return console.error('failed to find list to associated with merchant: ', err);
          }

          console.log('list: ', result);
        });
      });
    }
  });
}

subscriber.subscribe(PRICE_POINT_CHANNEL);
