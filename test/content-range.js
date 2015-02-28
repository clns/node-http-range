var assert = require("assert");
var ContentRange = require('..').ContentRange;
var RangeSpec = require('../lib/range-spec');

describe('ContentRange', function() {
  describe('#constructor()', function() {
    it('should not throw any error when correctly initialized', function() {
      assert.doesNotThrow(function() { new ContentRange('bytes', '*', '*'); });
      assert.doesNotThrow(function() { new ContentRange('random-token', '0-0', 0); });
      assert.doesNotThrow(function() { new ContentRange('bytes', new RangeSpec(0, 49), 50); });
      assert.doesNotThrow(function() { new ContentRange('bytes', '0-49', 50); });
      assert.doesNotThrow(function() { new ContentRange('bytes', '0-49', '*'); });
      assert.doesNotThrow(function() { new ContentRange('bytes', '*', 50); });
    });
    it('should throw specific error for invalid arguments', function() {
      assert.throws(function() { new ContentRange(); }, /Invalid unit/);
      assert.throws(function() { new ContentRange(2); }, /Invalid unit/);
      assert.throws(function() { new ContentRange(''); }, /Invalid unit/);
      assert.throws(function() { new ContentRange('byte s'); }, /Invalid unit/);

      assert.throws(function() { new ContentRange('bytes'); }, /Invalid range/);
      assert.throws(function() { new ContentRange('bytes', '20'); }, /Invalid range/);
      assert.throws(function() { new ContentRange('bytes', '-10'); }, /Invalid range/);
      assert.throws(function() { new ContentRange('bytes', '1-'); }, /Invalid range/);
      assert.throws(function() { new ContentRange('bytes', '0-49,50-99'); }, /Invalid range/);
      assert.throws(function() { new ContentRange('bytes', new RangeSpec(-1, 50)); }, /Invalid range/);
      assert.throws(function() { new ContentRange('bytes', new RangeSpec(40, 39)); }, /Invalid range/);

      assert.throws(function() { new ContentRange('bytes', '*'); }, /Invalid length/);
      assert.throws(function() { new ContentRange('bytes', '*', -1); }, /Invalid length/);

      assert.throws(function() { new ContentRange('bytes', new RangeSpec(0, 50), 49); }, /less than or equal/);
    });
  });
  describe('#toString()', function() {
    it('should create the output string correctly', function() {
      assert.equal(new ContentRange('bytes', '*', '*'), 'bytes */*');
      assert.equal(new ContentRange('random-token', new RangeSpec(0, 0), 0), 'random-token 0-0/0');
      assert.equal(new ContentRange('bytes', new RangeSpec(0, 49), 50), 'bytes 0-49/50');
      assert.equal(new ContentRange('bytes', '0-49', '*'), 'bytes 0-49/*');
      assert.equal(new ContentRange('bytes', '*', 50), 'bytes */50');
    });
  });
  describe('#parse()', function() {
    it('should not throw any error when parsing correct inputs', function() {
      assert.doesNotThrow(function() { ContentRange.prototype.parse('bytes 0-49/50'); });
      assert.doesNotThrow(function() { ContentRange.prototype.parse('bytes */*'); });
      assert.doesNotThrow(function() { ContentRange.prototype.parse('bytes 0-49/*'); });
      assert.doesNotThrow(function() { ContentRange.prototype.parse('bytes */200'); });
    });
    it('should throw specific error when parsing incorrect inputs', function() {
      assert.throws(function() { ContentRange.prototype.parse('bytes -49/50'); }, /Invalid input/);
      assert.throws(function() { ContentRange.prototype.parse('bytes=-49'); }, /Invalid input/);
      assert.throws(function() { ContentRange.prototype.parse('bytes=1-'); }, /Invalid input/);
      assert.throws(function() { ContentRange.prototype.parse('bytes=0-0,-1'); }, /Invalid input/);
    });
    it('should parse the input string correctly', function() {
      var cr = ContentRange.prototype.parse('bytes 0-49/50');
      assert.equal(cr.unit, 'bytes');
      assert.equal(cr.range.toString(), '0-49');
      assert.strictEqual(cr.length, 50);
      assert.strictEqual(cr.toString(), 'bytes 0-49/50');
      cr = ContentRange.prototype.parse('bytes */*');
      assert.equal(cr.range.toString(), '*');
      assert.equal(cr.length, null);
      assert.strictEqual(cr.toString(), 'bytes */*');
    });
  });
});