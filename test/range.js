var assert = require("assert");
var Range = require('..').Range;
var RangeSpec = require('../lib/range-spec');

describe('Range', function() {
  describe('#constructor()', function() {
    it('should not throw any error when correctly initialized', function() {
      assert.doesNotThrow(function() { new Range('bytes', '0-49'); });
      assert.doesNotThrow(function() { new Range('random-token', '0-0,-1'); });
      assert.doesNotThrow(function() { new Range('bytes', [new RangeSpec(0, 49)]); });
      assert.doesNotThrow(function() { new Range('bytes', [new RangeSpec(0, 49), new RangeSpec(undefined, 50)]); });
      assert.doesNotThrow(function() { new Range('bytes', '-49'); });
      assert.doesNotThrow(function() { new Range('bytes', '0-'); });
      assert.doesNotThrow(function() { new Range('bytes', '0-0,-1'); });
    });
    it('should throw specific error for invalid arguments', function() {
      assert.throws(function() { new Range(); }, /Invalid unit/);
      assert.throws(function() { new Range(2); }, /Invalid unit/);
      assert.throws(function() { new Range(''); }, /Invalid unit/);
      assert.throws(function() { new Range('byte s'); }, /Invalid unit/);

      assert.throws(function() { new Range('bytes'); }, /Invalid range/);
      assert.throws(function() { new Range('bytes', '*'); }, /Invalid range/);
      assert.throws(function() { new Range('bytes', new RangeSpec(0, 49)); }, /Invalid range/);
      assert.throws(function() { new Range('bytes', [new RangeSpec(0, 49), new RangeSpec(49, 48)]); }, /Invalid range/);
    });
  });
  describe('#toString()', function() {
    it('should create the output string correctly', function() {
      assert.equal(new Range('bytes', '0-49'), 'bytes=0-49');
      assert.equal(new Range('random-token', '0-0,-1'), 'random-token=0-0,-1');
      assert.equal(new Range('bytes', '-49'), 'bytes=-49');
      assert.equal(new Range('bytes', [new RangeSpec(0, 49)]), 'bytes=0-49');
      assert.equal(new Range('bytes', [new RangeSpec(0, 49), new RangeSpec(undefined, 50)]), 'bytes=0-49,-50');
      assert.equal(new Range('bytes', '0-'), 'bytes=0-');
    });
  });
  describe('#parse()', function() {
    it('should not throw any error when parsing correct inputs', function() {
      assert.doesNotThrow(function() { Range.prototype.parse('bytes=0-49'); });
      assert.doesNotThrow(function() { Range.prototype.parse('bytes=0-49,50-99,-30'); });
      assert.doesNotThrow(function() { Range.prototype.parse('bytes=1-'); });
    });
    it('should throw specific error when parsing incorrect inputs', function() {
      assert.throws(function() { Range.prototype.parse('bytes 49-50/51'); }, /Invalid input/);
      assert.throws(function() { Range.prototype.parse('bytes=49,50'); }, /Invalid input/);
      assert.throws(function() { Range.prototype.parse('bytes=*'); }, /Invalid input/);
    });
    it('should parse the input string correctly', function() {
      var r = Range.prototype.parse('bytes=0-49,50-99,-30');
      assert.equal(r.unit, 'bytes');
      assert.equal(r.ranges[0], '0-49');
      assert.equal(r.ranges[1], '50-99');
      assert.equal(r.ranges[2], '-30');
      assert.strictEqual(r.toString(), 'bytes=0-49,50-99,-30');
      r = Range.prototype.parse('bytes=0-');
      assert.equal(r.ranges[0], '0-');
      assert.strictEqual(r.toString(), 'bytes=0-');
    });
  });
});