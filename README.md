# ohlc-aggregator

Aggregates ohlcv candle values into coarse-grained intervals. The intervals should be either minutes or days.

The difference between this package and other packages is that rather than simply grouping each `n` candles into a group, if some candles from a group are missing, it still creates thouse groups.

For example, a naive implementation creates only one group for these candles:

- `time: 8:59am`
- `time: 9:00am`
- `time: 9:01am`
- `time: 9:02am`
- `time: 9:03am`

However, we need two groups:

- Group 1: `8:55 to 8:59`
- Group 2: `9:00 to 9:05`

This implementation still creates two groups although some candles are missing from each group.

# Usage

```javascript
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
  /*intervalRatio=*/ 5,
  /*intervalInSeconds=*/ 5 * 60
);

console.log("result: ", JSON.stringify(result, null, 1));
```
