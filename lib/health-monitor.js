require('colors');

var Hapi = require('hapi');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var Path = require('path');

var Scutter = require('./scutter').scutter;
var server = new Hapi.Server('localhost', '3002');

var Redis = require('./redis');
var redis = new Redis();

// serve static files (i.e. CSS files)
server.route({
  method:  'GET',
  path:    '/public/{param*}',
  handler: { directory: { path: 'health' } }
});
server.views({
  engines: { hbs: require('handlebars') },
  path: Path.join(__dirname, 'health/templates')
});


server.route({
  method: 'GET',
  path: '/health',
  handler: checkHealth
});

server.route({
  method: 'GET',
  path: '/health/{recipe}',
  handler: checkHealth
});

server.route({
  method: 'GET',
  path: '/swiper-history',
  handler: swiperHistory
});

server.route({
  method: 'GET',
  path: '/swiper-history/{recipe}',
  handler: swiperHistory
});

function checkHealth(request, reply) {
  var recipes;
  if(request.params.recipe) {
    recipes = [ recipeCheck(request.params.recipe) ];
  } else {
    recipes = fs.readdirSync(__dirname + '/../recipes')
      .filter(function(file) {
        if(file.indexOf('example') === -1) {
          return true;
        }
      })
      .map(function(recipe) {
        recipe = recipe.split('.')[0];
        return recipeCheck(recipe);
      });
  }

  async.parallelLimit(recipes, 10, function(error, results) {
    if(error) {
      return reply({error: error}).code(500);
    }

    if (request.headers.accept.indexOf('text/html') != -1) {
      reply.view('index', results);
    } else {
      reply(results);
    }
  });
}

function recipeCheck(recipe) {
  return function(cb) {
    recipe = require('../recipes/' + recipe + '.js');

    var scutter = new Scutter(recipe, { isHealthCheck: true, checkCount: 2 });
    scutter.on('done',function(result) {
      cb(null, result);
    });

    scutter.on('error', function(error) {
      console.warn(error.message.yellow);
    });

    scutter.start();
  }
}

function swiperHistory(request, reply) {
  var recipes;
  if(request.params.recipe) {
    recipes = [ recipeCheck(request.params.recipe) ];
  } else {
    recipes = fs.readdirSync(__dirname + '/../recipes')
      .filter(function(file) {
        if(file.indexOf('example') === -1) {
          return true;
        }
      })
      .map(function(recipe) {
        recipe = recipe.split('.')[0];
        return countHistory(recipe);
      });
  }

  async.parallelLimit(recipes, 10, function(error, results) {
    if(error) {
      return reply({error: error}).code(500);
    }

    reply(results);
  });
}

function countHistory(recipe) {
  return function(cb) {
    redis.hgetall('product-counts:' + recipe, function(err, response) {
      if(err) {
        return cb(null, err);
      }

      cb(null, {
        recipe: recipe,
        history: response
      });
    });
  }
}

server.start(function() {
  console.info('health-monitor running at:', server.info.uri);
});
