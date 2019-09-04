const monthInSeconds = 30 * 24 * 3600;
var moment = require("moment");

/**
 * If curIndex > firstLeftIndex, returns firstLeftIndex
 * otherwise, Decrements curIndex by intervalRatio
 * @param {Number} curIndex
 * @param {Array} array
 * @param {Number} intervalRatio
 * @param {Number} intervalInSeconds
 * @param {Number} firstLeftIndex
 * Set arrayTimeCoefficient to a value other than 1 if the time values in the input data is not in seconds
 * @param {Number} arrayTimeCoefficient
 * @returns {Number}
 */
function getNextLowerBound(
  curIndex,
  intervalRatio,
  intervalInSeconds,
  firstLeftIndex
) {
  // If not month
  if (intervalInSeconds !== monthInSeconds) {
    if (curIndex > firstLeftIndex) {
      return firstLeftIndex;
    } else {
      return curIndex - intervalRatio;
    }
  }

  throw "intervalInSeconds cannot be a month. It should only be days, hours, or minutes.";
}
//-----------------------------------------------------------------------------
/**
 * Aggregates to higher intervals
 * @param {Array} array : input ohlcv data
 * @param {Number} intervalRatio: ratio of the larger interval to the lower interval
 * @param {Number} intervalInSeconds: the larger interval in seconds
 * @param {Number} arrayTimeCoefficient: set this to 1000 if the time values in array are in second
 */
function aggregate(
  array,
  intervalRatio,
  intervalInSeconds,
  arrayTimeCoefficient = 1
) {
  let result = [];

  if (!array || !Array.isArray(array)) {
    return null;
  }

  if (array.length === 0) {
    return [];
  }

  if (array.length === 1) {
    return array;
  }

  let originalDurationInMS = (intervalInSeconds * 1000) / intervalRatio;
  const rightIndex = array.length - 1;

  let rightIndexTime = array[rightIndex].time * arrayTimeCoefficient;

  // If the interval is days
  if (originalDurationInMS === 60 * 60 * 1000) {
    let startOfDay = moment(
      array[rightIndex].time * arrayTimeCoefficient
    ).startOf("day");
    rightIndexTime = array[rightIndex].time * arrayTimeCoefficient - startOfDay;
  }

  // Offset of the rightIndex from firstLeftIndex
  let rightIndexOffset = rightIndexTime % (intervalInSeconds * 1000);

  // Check to see the time values are correct
  if (
    Math.round(rightIndexOffset / originalDurationInMS) !=
    rightIndexOffset / originalDurationInMS
  ) {
    console.log(
      `Warning [ohlc-aggregator]: the last element time ${rightIndexTime} is not divisible by ${originalDurationInMS}`
    );
  }

  let firstLeftIndex = rightIndex - rightIndexOffset / originalDurationInMS;
  if (firstLeftIndex > 0 && firstLeftIndex < array.length) {
  }

  for (
    let index = rightIndex;
    index > -intervalRatio;
    index = getNextLowerBound(
      index,
      intervalRatio,
      intervalInSeconds,
      firstLeftIndex
    )
  ) {
    let nextLowerBound = index;

    if (rightIndexOffset != 0) {
      nextLowerBound = getNextLowerBound(
        index,
        intervalRatio,
        intervalInSeconds,
        firstLeftIndex
      );
      index = nextLowerBound;
      rightIndexOffset = 0;
    }

    let lb = Math.max(0, nextLowerBound);
    let ub = nextLowerBound + intervalRatio;

    let intervalSlice = array.slice(lb, ub);

    let open = intervalSlice[0].open || 0;
    let high = intervalSlice[0].high || 0;
    let low = intervalSlice[0].low || Number.MAX_SAFE_INTEGER;
    let close = intervalSlice[intervalSlice.length - 1].close;
    let time = intervalSlice[0].time;

    // Adjust the time for incomplete candles from left
    if (nextLowerBound < 0) {
      time += (nextLowerBound * originalDurationInMS) / arrayTimeCoefficient;
    }

    let volumefrom = 0;
    let volumeto = 0;
    let volume = 0;

    // Find low, high and volume
    intervalSlice.forEach(e => {
      if (low > e.low) {
        low = e.low;
      }

      if (high < e.high) {
        high = e.high;
      }

      volumefrom += e.volumefrom || 0;
      volumeto += e.volumeto || 0;
      volume += e.volume || 0;
    });

    let value = {
      open: open,
      close: close,
      low: low,
      high: high,
      volume: volume,
      time: time
    };
    if (Object.keys(array[0]).includes("volumefrom")) {
      value["volumefrom"] = volumefrom;
    }

    if (Object.keys(array[0]).includes("volumeto")) {
      value["volumeto"] = volumeto;
    }

    result.push(value);
  }
  return result.reverse();
}
//-----------------------------------------------------------------------------
module.exports = function(
  ohlcv,
  intervalRatio,
  intervalInSeconds,
  arrayTimeCoefficient
) {
  return aggregate(
    ohlcv,
    intervalRatio,
    intervalInSeconds,
    arrayTimeCoefficient
  );
};
