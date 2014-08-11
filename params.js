var os = require('os');
var optimist = require('optimist')

.usage('Usage : $0 --recipe [merchant]')

.describe ('recipe', 'merchant recipe to apply')
.describe ('db', 'storage engine to persist results')
.default  ('db', 'http')
.describe ('http-endpoint', 'URL endpoint for POSTing prices')
.default  ('http-endpoint', 'http://localhost:8000/p')
.describe ('catalog-path', 'path to store pdp html files')
.default  ('catalog-path', os.tmpdir())
.describe ('concurrency', 'number of simultaneous requests to make')
.default  ('concurrency', 4)
.describe ('help', 'these usage instructions')
.alias    ('help', 'h')
;

var argv = optimist.argv;

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}

optimist.demand(['recipe']);

module.exports = optimist.argv;
