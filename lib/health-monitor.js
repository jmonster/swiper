require('colors');

var Hapi = require('hapi');
var Redis = require('./redis');
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var redis = new Redis();

var Scutter = require('./scutter').scutter;
var server = new Hapi.Server('localhost', '3002');

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

    reply(results);
  });
}

function recipeCheck(recipe) {
  return function(cb) {
    recipe = require('../recipes/' + recipe + '.js');
    var scutter = new Scutter(recipe, { isHealthCheck: true, checkCount: 1 });
    scutter.on('done',function(result) {
      cb(null, result);
    });

    scutter.on('error', function(error) {
      console.warn(error.message.yellow);
    });

    scutter.start();
  }
}

server.start(function() {
  console.info('health-monitor running at:', server.info.uri);
});
