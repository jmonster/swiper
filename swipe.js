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

var countDiscovery;

var rollbar;

scutter.on('done',function() {
  console.log('swiping completed'.blue);
  console.timeEnd('swiping');
  countDiscovery && countDiscovery.finish();
  rollbar && rollbar.finish();
});

// PRODUCTION
if (process.env.NODE_ENV === 'production') {
  rollbar = new require('./lib/rollbar')(scutter);
  countDiscovery = new require('./lib/count-discovery')(scutter,conf);
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
