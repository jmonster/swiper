#!/usr/bin/env node

console.time('swiping');

require('benny-hanes-socket-pool'); // voted best LOC of 2012
require('colors'); // prettyness

var async  = require('async');
var argv   = require('./params');
var recipe = require('./recipes/'+argv['recipe']+'.js');
var conf   = recipe.conf;

var Scutter = require('./lib/scutter').scutter;
var scutter = new Scutter(recipe);

scutter.on('done',function() {
  console.log('swiping completed'.blue);
  console.timeEnd('swiping');
});


// PRODUCTION
if (process.env.NODE_ENV === 'production') {
  var Rollbar = require('./lib/rollbar');
  Rollbar(scutter);

  var CountDiscovery = require('./lib/count-discovery');
  CountDiscovery(scutter,conf);
}
// < PRODUCTION

// DEVELOPMENT
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  scutter.on('error',function(error,additionalValues) {
    console.error(error,additionalValues);
  });
}
// < DEVELOPMENT


console.log('Swiper, no swiping!'.green.bold);
console.log(JSON.stringify(conf,null,2).yellow+'\r\n');  

scutter.start();
