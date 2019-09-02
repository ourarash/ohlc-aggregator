# ohlc-aggregator

[![NPM](https://badge.fury.io/js/ohlc-aggregator.svg)](https://www.npmjs.com/package/ohlc-aggregator)
<!-- [![NPM Downloads][downloadst-image]][downloads-url] -->

[downloads-image]: https://img.shields.io/npm/dm/ohlc-aggregator.svg
[downloadst-image]: https://img.shields.io/npm/dt/ohlc-aggregator.svg
[downloads-url]: https://npmjs.org/package/ohlc-aggregator

Aggregates ohlcv candle values into coarse-grained intervals. The intervals should be either minutes or days.

The difference between this package and other packages is that rather than simply grouping each `n` candles into a group, if some candles from a group are missing, it still creates those groups.

For example, in converting `1m` to `5m` candles, a naive implementation creates only one group for these candles:

- `time: 8:59am`
- `time: 9:00am`
- `time: 9:01am`
- `time: 9:02am`
- `time: 9:03am`

However, we need two groups:

- Group 1: `8:55 to 8:59`
- Group 2: `9:00 to 9:05`

This implementation still creates two groups although some candles are missing from each group.

## Install

```bash
npm i -s ohlc-aggregator
```


# Usage

```javascript
// Converting 1m to 5m candles
let ohlc_aggregate = require("ohlc-aggregator");
var moment = require("moment");

// Converting 1m candles to 5min candles:
let result = ohlc_aggregate(
  [
    {
      time: moment("10/15/2017 8:59", "M/D/YYYY H:mm").valueOf(), // timestamp in milliseconds
      open: 1,
      high: 5,
      low: 1,
      close: 2,
      volume: 100
    },
    {
      time: moment("10/15/2017 9:00", "M/D/YYYY H:mm").valueOf(), // timestamp in milliseconds
      open: 1,
      high: 5,
      low: 1,
      close: 2,
      volume: 100
    },
    {
      time: moment("10/15/2017 9:01", "M/D/YYYY H:mm").valueOf(), // timestamp in milliseconds
      open: 3,
      high: 10,
      low: 0,
      close: 6,
      volume: 200
    }
  ],
  /*intervalRatio=*/ 5,   // ration between original interval and the desired interval
  /*intervalInSeconds=*/ 5 * 60 // Interval duration in seconds
);

console.log("result: ", JSON.stringify(result, null, 1));
```
