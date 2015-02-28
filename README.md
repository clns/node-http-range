# http-range
Node.js parser for [Content-Range](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.16)
and [Range](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.35) HTTP header fields
according to the HTTP/1.1 specifications.

## Installation

```sh
$ npm install http-range
```

## Usage

```js
var ContentRange = require('http-range').ContentRange;
var Range = require('http-range').Range;

// Parsing and creating 'Content-Range' header
ContentRange.prototype.parse('bytes 0-49/50');  // Content-Range: bytes 0-49/50
new ContentRange('bytes', '0-49', 50).toString(); // => bytes 0-49/50

// Parsing and creating 'Range' header
Range.prototype.parse('bytes=0-49');  // Range: bytes=0-49
new Range('bytes', '0-49'); // => bytes=0-49
```

For more usages check the [test files](test).

## API

### `ContentRange` Class

###### new ContentRange(unit, range, length)

- `unit` {String} Usually 'bytes', but can be any token
- `range` {[RangeSpec](#rangespec-class)|String} A [RangeSpec](#rangespec-class) instance, a string like '0-49' or '\*' if unknown
- `length` {Number|'\*'} The total length of the full entity-body or '\*' if this length is unknown or difficult to determine

Throws error if arguments are invalid.

###### Properties

- `unit` {String}
- `range` {[RangeSpec](#rangespec-class)}
- `length` {Number|null} Null if unknown

###### Methods

- `toString()` Return a valid string value
- `parse(input)` Parse an input string. Throws error if invalid

#### Allowed Content-Range(s)

- `Content-Range: bytes 0-49/50`
- `Content-Range: bytes 0-49/*`
- `Content-Range: bytes */50`
- `Content-Range: bytes */*`

### `Range` Class

###### new Range(unit, ranges)

- `unit` {String} Usually 'bytes', but can be any token
- `ranges` {[RangeSpec](#rangespec-class)[]|String} An array of [RangeSpec](#rangespec-class) instances or a string like '0-49[,50-99][...]'

Throws error if arguments are invalid.

###### Properties

- `unit` {String}
- `ranges` {[RangeSpec](#rangespec-class)[]}

###### Methods

- `toString()` Return a valid string value
- `parse(input)` Parse an input string. Throws error if invalid

#### Allowed Range(s)

- `Range: bytes=0-49`
- `Range: bytes=0-49,50-99,-30`
- `Range: bytes=1-`
- `Range: bytes=-50`

### `RangeSpec` Class

###### new RangeSpec(low, high, size)

- `low` {Number|undefined}
- `high` {Number|undefined}
- `size` {Number|undefined} For validation only, optional

Throws error if arguments are invalid.

###### Properties

- `low` {Number|undefined}
- `high` {Number|undefined}

###### Methods

- `toString()` Return a valid string value
- `parse(input)` Parse an input string. Throws error if invalid

#### Examples of valid ranges

- `*`
- `0-49`
- `-49`
- `34-`

## Tests

```sh
$ make test
```