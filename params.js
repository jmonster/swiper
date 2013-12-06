var optimist = require('optimist')

.usage('Usage : $0 --recipe [merchant]')

.describe ('recipe', 'merchant recipe to apply')
.describe ('catalog-path', 'path to store pdp html files')
.describe ('concurrency', 'number of simultaneous requests to make')
.default  ('concurrency', 4)
.demand   (['recipe','catalog-path'])


.describe ('help', 'these usage instructions')
.alias    ('help', 'h')

;

var argv = module.exports = optimist.argv;

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}
