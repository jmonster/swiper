#!/usr/bin/env node

console.time('swiping');

require('benny-hanes-socket-pool'); // voted best LOC of 2012
require('colors'); // prettyness

var async  = require('async');
var argv   = require('./params');
var recipe = require('./recipes/'+argv['recipe']+'.js');
var conf   = recipe.conf;

var Scutter = require('./lib/scutter');
var scutter = new Scutter(recipe);

scutter.on('done',function() {
  console.log('swiping completed'.blue);
  console.timeEnd('swiping');
});

if (process.env.NODE_ENV === 'production') {
  // Rollbar
  var rollbar = require('rollbar');
  var rollbar_token = 'a8c70478b8ec473195a13927a3cb9a97';
  rollbar.init(rollbar_token);
  rollbar.handleUncaughtExceptions(rollbar_token);

  scutter.on('error',function(error,additionalValues) {
    if (additionalValues) {
      rollbar.handleErrorWithPayloadData(error, {'custom': additionalValues});
    }
    else {
      rollbar.handleError(error);
    }
  });
} else { // DEVELOPMENT
  scutter.on('error',function(error,additionalValues) {
    console.error(error,additionalValues);
  });
}

console.log('Swiper, no swiping!'.green.bold);
console.log(JSON.stringify(conf,null,2).yellow+'\r\n');  

scutter.start();
