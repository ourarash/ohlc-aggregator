let ohlc_aggregate = require("../lib/index");
var moment = require("moment");

// Converting 1m candles to 5min candles:
let result = ohlc_aggregate(
  [
    {
      time: moment("10/15/2017 8:59", "M/D/YYYY H:mm").valueOf(),
      open: 1,
      high: 5,
      low: 1,
      close: 2,
      volume: 100
    },
    {
      time: moment("10/15/2017 9:00", "M/D/YYYY H:mm").valueOf(),
      open: 1,
      high: 5,
      low: 1,
      close: 2,
      volume: 100
    },
    {
      time: moment("10/15/2017 9:01", "M/D/YYYY H:mm").valueOf(),
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

console.log("result: ", JSON.stringify(result, null, 1))
