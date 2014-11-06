var os = require('os');
var optimist = require('optimist')

.usage('Usage : $0 --recipe [merchant]')

.describe ('recipe', 'merchant recipe to apply')
.describe ('db', 'storage engine to persist results')
.default  ('db', 'http')
.describe ('batch-size', 'number of extracted values to batch')
.default  ('batch-size', 250)
.describe ('http-endpoint', 'URL endpoint for POSTing prices')
.default  ('http-endpoint', 'http://localhost:8000')
.describe ('es-endpoint', 'URL endpoint for elasticsearch')
.default  ('es-endpoint', 'http://elasticsearch.yayuhh.com:9200')
.describe ('mongo-endpoint', 'URL endpoint for elasticsearch')
.default  ('mongo-endpoint', 'mongodb://test:test@74.111.162.81:27018/test')  
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

// removing for now, we should move params into a configuration package
// optimist.demand(['recipe']);

module.exports = optimist.argv;
