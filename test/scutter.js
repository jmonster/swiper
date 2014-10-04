var Scutter = require('../lib/scutter');
var parsePrice = Scutter.parsePrice;

var should = require('chai').should();
var MICROS = 1000000;

describe('lib/scutter.js', function() {
  describe('#parsePrice(price)', function() {
    it('parse price with precision digits', function() {
      var price = parsePrice('$123.22');
      price.should.equal(123.22 * MICROS);
    });

    it('parse price with no precision digits', function() {
      var price = parsePrice('$123');
      price.should.equal(123 * MICROS);
    });

    it('parse lowest price in a range', function() {
      var price = parsePrice('$123.42 - $145.00');
      price.should.equal(123.42 * MICROS);
    });
  });
});
