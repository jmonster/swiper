var argv     = require('../../params.js');
var _ = require('lodash');
var Request  = require('request').defaults({
  'headers':{ 'User-Agent':'yayuhh/swiper' }
});

var ENDPOINT = argv['http-endpoint'] + '/p';

module.exports = function(namespace,url,blob,cb) {
  blob = _.isArray(blob) ? blob : [blob];
  Request.post({
    'url':  ENDPOINT,
    'json': {"products":blob}
  }, function(error,response,body) {
    if (error) {
      return console.error('Failed to POST price to ',ENDPOINT, ' due to ', error);
    }
    if (response.statusCode !== 204) {
      console.error("Unexpected status code: ",response.statusCode);
    }
  });

  if (cb) { cb() };
}
