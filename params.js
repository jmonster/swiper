var optimist = require('optimist')

.usage('Usage : $0 --recipe [merchant]')

.describe ('recipe', 'merchant recipe to apply')
.demand   (['recipe'])

.describe ('help', 'these usage instructions')
.alias    ('help', 'h')

;

var argv = module.exports = optimist.argv;

if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}
