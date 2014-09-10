var rollbar = require('rollbar');
var TOKEN = 'a8c70478b8ec473195a13927a3cb9a97';

module.exports = function(scutter) {
  rollbar.init(TOKEN);
  rollbar.handleUncaughtExceptions(TOKEN);

  scutter.on('error', function(error, additionalValues) {
    if (additionalValues) {
      rollbar.handleErrorWithPayloadData(error, {'custom': additionalValues});
    } else {
      rollbar.handleError(error);
    }
  });
}
