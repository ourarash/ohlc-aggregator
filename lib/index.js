const monthInSeconds = 30 * 24 * 3600;
var moment = require("moment");

/**
 * If i > firstLeftIndex, returns firstLeftIndex
 * otherwise, Decrements i by intervalRatio
 * If the intervals are month it accounts for the fact that some months are not
 * 30 days
 * @param {Number} i
 * @param {Array} array
 * @param {Number} intervalRatio
 * @param {Number} durationInSeconds
 * @param {Number} firstLeftIndex
 * @returns {Number}
 */
function getNextLowerBound(
  i,
  array,
  intervalRatio,
  durationInSeconds,
  firstLeftIndex
) {
  // If not month
  if (durationInSeconds !== monthInSeconds) {
    if (i > firstLeftIndex) {
      return firstLeftIndex;
    } else {
      return i - intervalRatio;
    }
  }

  // If month
  let currentTime = array[i].time;

  let startOfPreviousMonth = moment(currentTime * 1000 - 1000)
    .utcOffset(0)
    .startOf("month")
    .unix();

  for (let j = i; j > intervalRatio; j = j - 1) {
    const time = array[j].time;
    if (time <= startOfPreviousMonth) {
      let lowerBound = j;
      break;
    }
  }

  return Math.max(0, j);
}
//-----------------------------------------------------------------------------
/**
 *
 * @param {Array} array
 * @param {Number} intervalRatio
 * @param {Number} durationInSeconds
 */
function aggregate(array, intervalRatio, durationInSeconds) {
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
  let originalDurationInMS = (durationInSeconds * 1000) / intervalRatio;
  const rightIndex = array.length - 1;

  let diff = array[rightIndex].time;
  if (originalDurationInMS === 60 * 60 * 1000) {
    let startOfDay = moment(array[rightIndex].time).startOf("day");
    diff = array[rightIndex].time - startOfDay;
  }

  let extra = diff % (durationInSeconds * 1000);

  let firstLeftIndex = rightIndex - extra / originalDurationInMS;

  // Find the first start timestamp of the duration
  // We find a candle whose time is dividable by durationInSeconds
  // for (
  //   let index = rightIndex - 1;
  //   index >= Math.max(0, rightIndex - intervalRatio);
  //   --index
  // ) {
  //   let time = array[index].time;

  //   // For month we use moment()
  //   if (durationInSeconds === monthInSeconds) {
  //     let startOfMonth = moment()
  //       .utcOffset(0)
  //       .startOf("month")
  //       .unix();
  //     log(
  //       "startOfMonth: ",
  //       moment(startOfMonth * 1000)
  //         .utcOffset(0)
  //         .format()
  //     );
  //     log(
  //       "time: ",
  //       moment(time * 1000)
  //         .utcOffset(0)
  //         .format()
  //     );

  //     if (time === startOfMonth) {
  //       break;
  //     }
  //   } else {
  //     firstLeftIndex = index;
  //     if (time % (durationInSeconds * 1000) === 0) {
  //       break;
  //     }
  //   }
  // }

  // if (array[firstLeftIndex] % (durationInSeconds * 1000) !== 0){
  //   firstLeftIndex=0;
  // }

  // In each iteration, aggregates values between
  // [getNextLowerBound(index), getNextLowerBound(index) + intervalRatio]
  for (
    let index = rightIndex;
    index > -intervalRatio;
    index = getNextLowerBound(
      index,
      array,
      intervalRatio,
      durationInSeconds,
      firstLeftIndex
    )
  ) {
    let nextLowerBound = index;

    if (extra != 0) {
      nextLowerBound = getNextLowerBound(
        index,
        array,
        intervalRatio,
        durationInSeconds,
        firstLeftIndex
      );
      index = nextLowerBound;
      extra = 0;
    }

    let lb = Math.max(0, nextLowerBound);
    let ub = nextLowerBound + intervalRatio;

    let intervalSlice = array.slice(lb, ub);

    let open = intervalSlice[0].open || 0;
    let high = intervalSlice[0].high || 0;
    let low = intervalSlice[0].low || Number.MAX_SAFE_INTEGER;
    let close = intervalSlice[intervalSlice.length - 1].close;
    let time = intervalSlice[0].time;
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

module.exports = function(ohlcv, intervalRatio, durationInSeconds) {
  return aggregate(ohlcv, intervalRatio, durationInSeconds);
};
