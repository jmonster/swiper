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

scutter.drain = function() {
  console.log('swiping completed'.blue);
  console.timeEnd('swiping');
};

// TODO support async pre methods
if (recipe.pre) { recipe.pre(scutter); }

console.log('Swiper, no swiping!'.green.bold);
console.log(JSON.stringify(conf,null,2).yellow+'\r\n');  

scutter.start();
