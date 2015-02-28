var assert = require("assert");
var RangeSpec = require('../lib/range-spec');

describe('RangeSpec', function() {
  describe('#constructor()', function() {
    it('should not throw any error when correctly initialized', function() {
      assert.doesNotThrow(function() { new RangeSpec(0, 49); });
      assert.doesNotThrow(function() { new RangeSpec(0, 49, 50); });
      assert.doesNotThrow(function() { new RangeSpec(undefined, 49, 50); });
      assert.doesNotThrow(function() { new RangeSpec(undefined, 49); });
      assert.doesNotThrow(function() { new RangeSpec(0, undefined, 50); });
      assert.doesNotThrow(function() { new RangeSpec(0); });
      assert.doesNotThrow(function() { new RangeSpec(undefined, undefined, 50); });
      assert.doesNotThrow(function() { new RangeSpec(); });
    });
    it('should throw specific error for invalid arguments', function() {
      assert.throws(function() { new RangeSpec(0, '49'); }, /Invalid range/);
      assert.throws(function() { new RangeSpec(0, 49, 49); }, /Invalid range/);
      assert.throws(function() { new RangeSpec(-1, 49, 50); }, /Invalid range/);
      assert.throws(function() { new RangeSpec(0, -49, 50); }, /Invalid range/);
      assert.throws(function() { new RangeSpec(0, 49, -50); }, /Invalid range/);
      assert.throws(function() { new RangeSpec(49, 48); }, /Invalid range/);
    });
  });
  describe('#toString()', function() {
    it('should create the output string correctly', function() {
      assert.equal(new RangeSpec(0, 49), '0-49');
      assert.equal(new RangeSpec(undefined, 49), '-49');
      assert.equal(new RangeSpec(1), '1-');
      assert.equal(new RangeSpec(), '*');
    });
  });
  describe('#parse()', function() {
    it('should not throw any error when parsing correct inputs', function() {
      assert.doesNotThrow(function() { RangeSpec.prototype.parse('*'); });
      assert.doesNotThrow(function() { RangeSpec.prototype.parse('0-49'); });
      assert.doesNotThrow(function() { RangeSpec.prototype.parse('0-49', 50); });
      assert.doesNotThrow(function() { RangeSpec.prototype.parse('-49'); });
      assert.doesNotThrow(function() { RangeSpec.prototype.parse('-49', '50'); });
      assert.doesNotThrow(function() { RangeSpec.prototype.parse('1-'); });
      assert.doesNotThrow(function() { RangeSpec.prototype.parse('1-', '50'); });
    });
    it('should throw specific error when parsing incorrect inputs', function() {
      assert.throws(function() { RangeSpec.prototype.parse('-1-'); }, /Invalid range/);
      assert.throws(function() { RangeSpec.prototype.parse('-2', 1); }, /Invalid range/);
      assert.throws(function() { RangeSpec.prototype.parse(''); }, /Invalid range/);
      assert.throws(function() { RangeSpec.prototype.parse('**'); }, /Invalid range/);
      assert.throws(function() { RangeSpec.prototype.parse('0--49'); }, /Invalid range/);
      assert.throws(function() { RangeSpec.prototype.parse('0-49', '49'); }, /Invalid range/);
    });
    it('should parse the input string correctly', function() {
      var rs = RangeSpec.prototype.parse('0-49');
      assert.strictEqual(rs.low, 0);
      assert.strictEqual(rs.high, 49);
      assert.strictEqual(rs.toString(), '0-49');
      rs = RangeSpec.prototype.parse('*');
      assert.strictEqual(rs.low, undefined);
      assert.strictEqual(rs.high, undefined);
      assert.strictEqual(rs.toString(), '*');
      rs = RangeSpec.prototype.parse('1-');
      assert.strictEqual(rs.low, 1);
      assert.strictEqual(rs.high, undefined);
      assert.strictEqual(rs.toString(), '1-');
      rs = RangeSpec.prototype.parse('-49');
      assert.strictEqual(rs.low, undefined);
      assert.strictEqual(rs.high, 49);
      assert.strictEqual(rs.toString(), '-49');
    });
  });
});