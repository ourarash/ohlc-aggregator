# ohlc-aggregator

[![NPM](https://badge.fury.io/js/ohlc-aggregator.svg)](https://www.npmjs.com/package/ohlc-aggregator)
[![NPM Downloads][downloadst-image]][downloads-url]

[downloads-image]: https://img.shields.io/npm/dm/ohlc-aggregator.svg
[downloadst-image]: https://img.shields.io/npm/dt/ohlc-aggregator.svg
[downloads-url]: https://npmjs.org/package/ohlc-aggregator

Aggregates ohlcv candle values into predictable coarse-grained intervals. The intervals should be either minutes or days.

The difference between this package and other packages is that rather than simply grouping each `n` candles into a group, we create predictive interval where the start time of each interval is divisible by `n`. If some candles from an interval are missing, we still create those interval.

## Example 1

In converting `1m` to `5m` candles, a naive implementation creates only one group for the following 5 candles:

1. `time: 8:59am`
2. `time: 9:00am`
3. `time: 9:01am`
4. `time: 9:02am`
5. `time: 9:03am`

However, this package creates two groups based on predictable timing intervals, i.e., the start of each timing interval is divisible by 5m:

- Group 1: `8:55 to 8:59`
- Group 2: `9:00 to 9:05`

We still create two groups although some candles are missing from each group.

## Example 2

Consider these candles:

1. `time: 8:59am`
2. `time: 9:00am`
3. `time: 9:01am`
4. `time: 9:02am`
5. `time: 9:03am`
6. `time: 9:04am`
7. `time: 9:05am`
8. `time: 9:06am`

A naive implementation will create these groups:

- Group 1: `8:59 to 9:03`, (complete candle)
- Group 2: `9:04 to 9:06`, (incomplete candle)

However, a predictable grouping would be:

- Group 1: `8:55 to 9:00`, (incomplete candle)
- Group 1: `9:00 to 9:04`, (complete candle)
- Group 2: `9:05 to 9:09`, (incomplete candle)


# Install

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
