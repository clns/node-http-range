/**
 * Range spec class according to http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.16
 * and http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35
 *
 * @param {Number|undefined} low
 * @param {Number|undefined} high
 * @param {Number|undefined} [size] For validation only
 * @constructor
 */
function RangeSpec(low, high, size) {
  var s = size === undefined ? Number.POSITIVE_INFINITY : size;
  var l = low === undefined ? Number.NEGATIVE_INFINITY : low;
  var h = high === undefined ? Math.min(Number.POSITIVE_INFINITY, s-1) : high;

  if (typeof(l) !== 'number' ||
    typeof(h) !== 'number' ||
    typeof(s) !== 'number' ||
    !(l <= h) || !(h < s) && h !== Number.POSITIVE_INFINITY ||
    l < 0 && l !== Number.NEGATIVE_INFINITY) {
    throw new Error('Invalid range');
  }

  this._range = [low, high];
}

Object.defineProperties(RangeSpec.prototype, {
  low: { get: function() { return this._range[0]; } },
  high: { get: function() { return this._range[1]; } }
});

/**
 * Possible return values:
 *
 * - '*'
 * - '0-49'
 * - '-49'
 * - '34-'
 *
 * @returns {String}
 */
RangeSpec.prototype.toString = function() {
  if (this._range.toString() === ',') {
    return '*';
  }
  return this._range.join('-');
};

/**
 * @see RangeSpec.prototype.toString()
 * @param {String} string
 * @param {Number|String|undefined} [size] For validation only
 * @returns {RangeSpec}
 */
RangeSpec.prototype.parse = function(string, size) {
  var matches;
  if (typeof(string) === 'string' &&
    (matches = string.match(/^(\d+-\d+|\d+-|-\d+|\*)$/))) {
    var vals = matches[1].split('-').map(function(v) { return v === '*' || v === '' ? undefined : parseInt(v); });
    return new RangeSpec(vals[0], vals[1], size === undefined ? size : parseInt(size));
  }
  throw new Error('Invalid range');
};

module.exports = RangeSpec;
