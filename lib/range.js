var RangeSpec = require('./range-spec');

/**
 * Range HTTP Header class.
 *
 * @param {String} unit Usually "bytes", but can be any token; http://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.12
 * @param {RangeSpec[]|String} ranges An array of RangeSpec instances or a string like '0-49[,50-99][...]'
 * @constructor
 * @throws Error
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35
 */
function Range(unit, ranges) {
  this.unit = unit;
  this.ranges = ranges;
}

Object.defineProperties(Range.prototype, {
  unit: {
    get: function() { return this._unit; },
    set: function(v) {
      if (typeof(v) !== 'string' ||
        !v.length ||
        /\s/.test(v)) { // don't allow white characters
        throw new Error('Invalid unit');
      }
      this._unit = v;
    }
  },
  ranges: {
    get: function() { return this._ranges; },
    set: function(v) {
      if (Object.prototype.toString.call(v) === '[object Array]') {
        v.forEach(function(range) {
          if (!(range instanceof RangeSpec)) {
            throw new Error('Invalid range');
          }
        });
        this._ranges = v;
      }
      else if (typeof(v) === 'string' &&
        /^((\d+-\d+|-\d+|\d+-),?)+$/.test(v)) {
        this._ranges = [];
        v.split(',').forEach(function(range) {
          this._ranges.push(RangeSpec.prototype.parse(range));
        }, this);
      }
      else {
        throw new Error('Invalid range');
      }
    }
  }
});

Range.prototype.toString = function() {
  return this.unit + '=' + this.ranges.join(',');
};

/**
 * Parse a string and return an instance of the object if successful.
 *
 * @param {String} string
 * @returns {Range}
 * @throws Error
 */
Range.prototype.parse = function(string) {
  var matches;
  if (typeof(string) === 'string' &&
    (matches = string.match(/^([^\s]+)=((?:(?:\d+-\d+|-\d+|\d+-),?)+)$/))) {
    return new Range(matches[1], matches[2]);
  }
  throw new Error('Invalid input');
};

module.exports = Range;
