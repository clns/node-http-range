var RangeSpec = require('./range-spec');

/**
 * Content-Range HTTP Header class.
 *
 * @param {String} unit Usually "bytes", but can be any token; http://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.12
 * @param {RangeSpec|String|'*'} range A RangeSpec instance, a string like '0-49' or '*' if unknown
 * @param {Number|'*'} length The total length of the full entity-body or '*' if this length is unknown or difficult to determine
 * @constructor
 * @throws Error
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.16
 */
function ContentRange(unit, range, length) {
  this.unit = unit;
  this.range = range;
  this.length = length;
  if (this.range.high && this.length && this.length <= this.range.high) {
    throw new Error('Length is less than or equal to the range');
  }
}

Object.defineProperties(ContentRange.prototype, {
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
  range: {
    get: function() { return this._range; },
    set: function(v) {
      if (v instanceof RangeSpec) {
        this._range = v;
      }
      else if (typeof(v) === 'string' &&
        (v = RangeSpec.prototype.parse(v)) &&
        /^\d+-\d+|\*$/.test(v.toString())) {
        this._range = v;
      }
      else {
        throw new Error('Invalid range');
      }
    }
  },
  length: {
    get: function() { return this._length; },
    set: function(v) {
      if (v === '*') {
        this._length = null;
      }
      else if (!isNaN(v) && (v = parseInt(v)) >= 0) {
        this._length = v;
      }
      else {
        throw new Error('Invalid length');
      }
    }
  }
});

ContentRange.prototype.toString = function() {
  return this.unit + ' ' +
    this.range.toString() + '/' +
    (this.length!==null ? this.length : '*');
};

/**
 * Parse a string and return an instance of the object if successful.
 *
 * @param {String} string Eg. 'bytes 0-49/50', or 'bytes 0-49/*'
 * @returns {ContentRange}
 * @throws Error
 */
ContentRange.prototype.parse = function(string) {
  var matches;
  if (typeof(string) === 'string' &&
    (matches = string.match(/^([^\s]+) (\d+-\d+|\*)\/(\d+|\*)$/))) {
    return new ContentRange(matches[1], matches[2], matches[3]);
  }
  throw new Error('Invalid input');
};

module.exports = ContentRange;
