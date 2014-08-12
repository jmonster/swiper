var argv     = require('../../params.js');
var Request  = require('request').defaults({
  'headers':{ 'User-Agent':'yayuhh/swiper' }
});

var ENDPOINT = argv['http-endpoint'] + '/p';


module.exports = function(stash,url,blob,cb) {
  Request.post({
    'url':  ENDPOINT,
    'json': {"prices":[blob]}
  }, function(error,response,body) {
    if (error) { return console.error(error); }
    if (response.statusCode !== 204) {
      console.error("Unexpected status code: ",response.statusCode);
    }
  });

  cb && cb();
}
