var rollbar = require('rollbar');

var TOKEN = 'a8c70478b8ec473195a13927a3cb9a97';
rollbar.init(TOKEN);
rollbar.handleUncaughtExceptions(TOKEN);

module.exports = Rollbar;

function Rollbar(scutter) {
  if(!(this instanceof Rollbar)) {
    return new Rollbar(scutter);
  }

  scutter.on('error', function(error, additionalValues) {
    if (additionalValues) {
      rollbar.handleErrorWithPayloadData(error, {'custom': additionalValues});
    } else {
      rollbar.handleError(error);
    }
  });
}

Rollbar.prototype.finish = function() {
  rollbar.shutdown();
}
