var redis = require('redis');

module.exports = function Redis(opts) {
  opts = opts || {};

  var port = opts.port || process.env.REDIS_PORT || 6379;
  var host = opts.host || process.env.REDIS_HOST || 'localhost';
  var pw   = opts.password || process.env.REDIS_PASSWORD;

  // create redis client
  var rcli = redis.createClient(port,host);

  // authenticate with provided password
  if (pw) {
    rcli.auth(pw,function(err) {
      if (err) { console.log('redis auth error:' + err); }
    });
  }

  // log redis ready state
  rcli.on('ready', function() {
    console.log('redis' + ' connected to ' + host + ':' + port);
  });

  // avoid crashing the server when redis disconnects
  // (+ log the event to STDERR)
  rcli.on('error', function() {
    console.error('redis' + ' disconnected from ' + host);
  });

  return rcli;
};
