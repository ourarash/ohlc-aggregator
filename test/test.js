"use strict";

var expect = require("chai").expect;
var ohlc_aggregate = require("../lib/index");
var moment = require("moment");

function basicTests() {
  it("should return null if input is null", function() {
    var result = ohlc_aggregate();
    expect(result).to.deep.equal(null);
  });

  it("should return [] if input length is 0", function() {
    var result = ohlc_aggregate([]);
    expect(result).to.deep.equal([]);
  });

  it("should return an array of length 1 if input is of length 1", function() {
    var result = ohlc_aggregate(
      [
        {
          time: 1525651200,
          close: 9377.81,
          high: 9662.23,
          low: 9202.13,
          open: 9643.99,
          volume: 73842.44
        }
      ],
      /*intervalRatio=*/ 5,
      /*intervalInSeconds=*/ 5 * 60
    );
    expect(result).to.deep.equal([
      {
        time: 1525651200,
        close: 9377.81,
        high: 9662.23,
        low: 9202.13,
        open: 9643.99,
        volume: 73842.44
      }
    ]);
  });
}

function lengthTwoTests() {
  it("should return an array of length 1 if input is of length 2 and one is divisable by intervalInSeconds", function() {
    var result = ohlc_aggregate(
      [
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
          close: 2,
          volume: 200
        }
      ],
      /*intervalRatio=*/ 5,
      /*intervalInSeconds=*/ 5 * 60
    );
    expect(result).to.deep.equal([
      {
        time: moment("10/15/2017 9:00", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 10,
        low: 0,
        close: 2,
        volume: 300
      }
    ]);
  });
}

function lengthThreeTests() {
  it("should return an array of length 2 if input is of length 3 and middle one is divisable by intervalInSeconds", function() {
    var result = ohlc_aggregate(
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
    expect(result).to.deep.equal([
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
        high: 10,
        low: 0,
        close: 6,
        volume: 300
      }
    ]);
  });

  it("should return an array of length 1 if input is of length 3 and last one is divisable by intervalInSeconds", function() {
    var result = ohlc_aggregate(
      [
        {
          time: moment("10/15/2017 8:58", "M/D/YYYY H:mm").valueOf(),
          open: 1,
          high: 5,
          low: 1,
          close: 2,
          volume: 100
        },
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
    expect(result).to.deep.equal([
      {
        time: moment("10/15/2017 8:58", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 5,
        low: 1,
        close: 2,
        volume: 200
      },
      {
        time: moment("10/15/2017 9:00", "M/D/YYYY H:mm").valueOf(),
        open: 3,
        high: 10,
        low: 0,
        close: 6,
        volume: 200
      }
    ]);
  });

  it("should return an array of length 1 if input is of length 3 and first one is divisable by intervalInSeconds", function() {
    var result = ohlc_aggregate(
      [
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
          open: 1,
          high: 5,
          low: 1,
          close: 2,
          volume: 100
        },
        {
          time: moment("10/15/2017 9:02", "M/D/YYYY H:mm").valueOf(),
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
    expect(result).to.deep.equal([
      {
        time: moment("10/15/2017 9:00", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 10,
        low: 0,
        close: 6,
        volume: 400
      }
    ]);
  });

  it("should return an array of length 1 if input is of length 3 and none is divisable by intervalInSeconds", function() {
    var result = ohlc_aggregate(
      [
        {
          time: moment("10/15/2017 9:01", "M/D/YYYY H:mm").valueOf(),
          open: 1,
          high: 5,
          low: 1,
          close: 2,
          volume: 100
        },
        {
          time: moment("10/15/2017 9:02", "M/D/YYYY H:mm").valueOf(),
          open: 4,
          high: 16,
          low: 1,
          close: 3,
          volume: 100
        },
        {
          time: moment("10/15/2017 9:03", "M/D/YYYY H:mm").valueOf(),
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
    expect(result).to.deep.equal([
      {
        time: moment("10/15/2017 9:01", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 16,
        low: 0,
        close: 6,
        volume: 400
      }
    ]);
  });
}

function lengthTenTests() {
  it("should return an array of length 2 if input is of length 10 and first one is divisable by intervalInSeconds", function() {
    let data = [
      {
        time: moment("10/15/2017 9:00", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 5,
        low: 1,
        close: 2,
        volume: 100
      }
    ];
    for (let index = 1; index < 10; index++) {
      let rand = Math.floor(Math.random() * 10);
      let newData = {
        time: data[0].time + index * 60 * 1000,
        open: data[0].open + rand,
        high: data[0].high + rand,
        low: data[0].low + rand,
        close: data[0].close + rand,
        volume: data[0].volume
      };
      data.push(newData);
    }

    var result = ohlc_aggregate(
      data,
      /*intervalRatio=*/ 5,
      /*intervalInSeconds=*/ 5 * 60
    );

    expect(result).to.deep.equal([
      {
        open: data[0].open,
        close: data[4].close,
        low: data
          .slice(0, 5)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(0, 5)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data.slice(0, 5).reduce((acm, e) => e.volume + acm, 0),
        time: data[0].time
      },
      {
        open: data[5].open,
        close: data[9].close,
        low: data
          .slice(5, 10)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(5, 10)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data.slice(5, 10).reduce((acm, e) => e.volume + acm, 0),
        time: data[5].time
      }
    ]);
  });

  it("should return an array of length 3 if input is of length 10 and first one is one after the aggregate time", function() {
    let data = [
      {
        time: moment("10/15/2017 9:01", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 5,
        low: 1,
        close: 2,
        volume: 100
      }
    ];

    for (let index = 1; index < 10; index++) {
      let rand = Math.floor(Math.random() * 10);
      let newData = {
        time: data[0].time + index * 60 * 1000,
        open: data[0].open + rand,
        high: data[0].high + rand,
        low: data[0].low + rand,
        close: data[0].close + rand,
        volume: data[0].volume
      };
      data.push(newData);
    }

    var result = ohlc_aggregate(
      data,
      /*intervalRatio=*/ 5,
      /*intervalInSeconds=*/ 5 * 60
    );

    expect(result).to.deep.equal([
      {
        open: data[0].open,
        close: data[3].close,
        low: data
          .slice(0, 4)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(0, 4)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data.slice(0, 4).reduce((acm, e) => e.volume + acm, 0),
        time: data[0].time
      },
      {
        open: data[4].open,
        close: data[8].close,
        low: data
          .slice(4, 9)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(4, 9)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data.slice(4, 9).reduce((acm, e) => e.volume + acm, 0),
        time: data[4].time
      },
      data[9]
    ]);
  });

  it("should return an array of length 3 if input is of length 10 and first one is one before the aggregate time", function() {
    let data = [
      {
        time: moment("10/15/2017 8:59", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 5,
        low: 1,
        close: 2,
        volume: 100
      }
    ];

    for (let index = 1; index < 10; index++) {
      let rand = Math.floor(Math.random() * 10);
      let newData = {
        time: data[0].time + index * 60 * 1000,
        open: data[0].open + rand,
        high: data[0].high + rand,
        low: data[0].low + rand,
        close: data[0].close + rand,
        volume: data[0].volume
      };
      data.push(newData);
    }

    var result = ohlc_aggregate(
      data,
      /*intervalRatio=*/ 5,
      /*intervalInSeconds=*/ 5 * 60
    );

    expect(result).to.deep.equal([
      data[0],
      {
        open: data[1].open,
        close: data[5].close,
        low: data
          .slice(1, 6)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(1, 6)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data.slice(1, 6).reduce((acm, e) => e.volume + acm, 0),
        time: data[1].time
      },
      {
        open: data[6].open,
        close: data[9].close,
        low: data
          .slice(6, 10)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(6, 10)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data.slice(6, 10).reduce((acm, e) => e.volume + acm, 0),
        time: data[6].time
      }
    ]);
  });
}

//-----------------------------------------------------------------------------

describe("#OHLC-Aggregate-1m-to-5m", function() {
  basicTests();
  lengthTwoTests();
  lengthThreeTests();

  lengthTenTests();
});

describe("#OHLC-Aggregate-1m-to-10m", function() {
  it("should return an array of length 2 if input is of length 10 and first one is divisable by intervalInSeconds", function() {
    let intervalRatio = 10;
    let data = [
      {
        time: moment("10/15/2017 9:00", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 5,
        low: 1,
        close: 2,
        volume: 100
      }
    ];
    for (let index = 1; index < intervalRatio * 2; index++) {
      let rand = Math.floor(Math.random() * 10);
      let newData = {
        time: data[0].time + index * 60 * 1000,
        open: data[0].open + rand,
        high: data[0].high + rand,
        low: data[0].low + rand,
        close: data[0].close + rand,
        volume: data[0].volume
      };
      data.push(newData);
    }

    var result = ohlc_aggregate(
      data,
      /*intervalRatio=*/ intervalRatio,
      /*intervalInSeconds=*/ intervalRatio * 60
    );

    expect(result).to.deep.equal([
      {
        open: data[0].open,
        close: data[intervalRatio - 1].close,
        low: data
          .slice(0, intervalRatio)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(0, intervalRatio)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data
          .slice(0, intervalRatio)
          .reduce((acm, e) => e.volume + acm, 0),
        time: data[0].time
      },
      {
        open: data[intervalRatio].open,
        close: data[2 * intervalRatio - 1].close,
        low: data
          .slice(intervalRatio, intervalRatio * 2)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(intervalRatio, intervalRatio * 2)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data
          .slice(intervalRatio, intervalRatio * 2)
          .reduce((acm, e) => e.volume + acm, 0),
        time: data[intervalRatio].time
      }
    ]);
  });
});

describe("#OHLC-Aggregate-1h-to-4h", function() {
  it("should return an array of length 2 if input is of length 8 and first one is divisable by intervalInSeconds", function() {
    let intervalRatio = 4;
    let data = [
      {
        time: moment("10/15/2017 8:00", "M/D/YYYY H:mm").valueOf(),
        open: 1,
        high: 5,
        low: 1,
        close: 2,
        volume: 100
      }
    ];
    for (let index = 1; index < intervalRatio * 2; index++) {
      let rand = Math.floor(Math.random() * 10);
      let newData = {
        time: data[0].time + index * 60 * 60 * 1000,
        open: data[0].open + rand,
        high: data[0].high + rand,
        low: data[0].low + rand,
        close: data[0].close + rand,
        volume: data[0].volume
      };
      data.push(newData);
    }

    var result = ohlc_aggregate(
      data,
      /*intervalRatio=*/ intervalRatio,
      /*intervalInSeconds=*/ intervalRatio * 60 * 60
    );

    expect(result).to.deep.equal([
      {
        open: data[0].open,
        close: data[intervalRatio - 1].close,
        low: data
          .slice(0, intervalRatio)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(0, intervalRatio)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data
          .slice(0, intervalRatio)
          .reduce((acm, e) => e.volume + acm, 0),
        time: data[0].time
      },
      {
        open: data[intervalRatio].open,
        close: data[2 * intervalRatio - 1].close,
        low: data
          .slice(intervalRatio, intervalRatio * 2)
          .reduce((acm, e) => Math.min(e.low, acm), Number.MAX_SAFE_INTEGER),
        high: data
          .slice(intervalRatio, intervalRatio * 2)
          .reduce((acm, e) => Math.max(e.high, acm), Number.MIN_SAFE_INTEGER),
        volume: data
          .slice(intervalRatio, intervalRatio * 2)
          .reduce((acm, e) => e.volume + acm, 0),
        time: data[intervalRatio].time
      }
    ]);
  });
});

// describe("#OHLC-Aggregate-1m-to-5m-cc", function() {
//   console.log("Salam");
//   it("should return an array of length 2 if input is of length 8 and first one is divisable by intervalInSeconds", async function() {
//     // let data = await cc.histoMinute("BTC", "USD", { limit: 10 });
//     // let dataAgg = await cc.histoMinute("BTC", "USD", { limit: 2, aggregate: "5" });
//     let data1;
//     let data1Agg;
//     let data = [];
//     let dataAgg = [];
//     let exchange;
//     try {
//       exchange = new ccxt["bitfinex"]();
//     } catch (error) {
//       console.log("Error: ", error);
//     }
//     const min = 60 * 1000;
//     let since = exchange.milliseconds() - 20 * min;
//     let sinceAgg = exchange.milliseconds() - 20 * min;

//     try {
//       data1 = await exchange.fetchOHLCV(`BTC/USD`, "1m", since, 10);
//     } catch (error) {
//       console.log("Error: ", error);
//     }

//     try {
//       data1Agg = await exchange.fetchOHLCV(`BTC/USD`, "5m", sinceAgg, 2);
//     } catch (error) {
//       console.log("Error: ", error);
//     }

//     for (const d of data1) {
//       data.push({
//         time: d[0],
//         open: d[1],
//         high: d[2],
//         low: d[3],
//         close: d[4],
//         volume: d[5]
//       });
//     }

//     for (const d of data1Agg) {
//       dataAgg.push({
//         time: d[0],
//         open: d[1],
//         high: d[2],
//         low: d[3],
//         close: d[4],
//         volume: d[5]
//       });
//     }

//     // for (const d of dataAgg) {
//     //   d["volume"]= d.volumeto;
//     //   d["time"]= d.time * 1000;
//     // }

//     let intervalRatio = 5;

//     console.log("data: ", JSON.stringify(data, null, 2));
//     console.log("dataAgg: ", JSON.stringify(dataAgg, null, 2));
//     var result = ohlc_aggregate(
//       data,
//       /*intervalRatio=*/ intervalRatio,
//       /*intervalInSeconds=*/ intervalRatio * 60
//     );

//     expect(result).to.deep.equal(dataAgg);
//   });
// });

describe("#OHLC-Aggregate-1m-to-5m-ccxt-sample", function() {
  it("should return an array of length 3 for this sample", function() {
    let data = [
      {
        time: 1567361880000,
        open: 9626.981274,
        high: 9626.981274,
        low: 9626.9,
        close: 9626.9,
        volume: 0.94270682
      },
      {
        time: 1567361940000,
        open: 9626.9,
        high: 9626.90964075,
        low: 9626.9,
        close: 9626.90964075,
        volume: 0.45494175
      },
      {
        time: 1567362000000,
        open: 9626.9,
        high: 9626.90963142,
        low: 9616.1,
        close: 9616.3,
        volume: 1.01075833
      },
      {
        time: 1567362060000,
        open: 9624.9,
        high: 9626.7,
        low: 9624.9,
        close: 9626.040496,
        volume: 0.9088545299999999
      },
      {
        time: 1567362120000,
        open: 9626,
        high: 9626,
        low: 9622.1,
        close: 9622.1,
        volume: 0.195106
      },
      {
        time: 1567362180000,
        open: 9622.6,
        high: 9624.1,
        low: 9622,
        close: 9624.1,
        volume: 0.21193979999999998
      },
      {
        time: 1567362240000,
        open: 9623.2,
        high: 9624.81764813,
        low: 9622.2,
        close: 9622.2,
        volume: 0.19835183
      },
      {
        time: 1567362300000,
        open: 9623.2,
        high: 9624.81764813,
        low: 9622.2,
        close: 9622.2,
        volume: 0.19835183
      },
      {
        time: 1567362360000,
        open: 9623.2,
        high: 9625.9,
        low: 9623.2,
        close: 9625.9,
        volume: 0.01
      },
      {
        time: 1567362420000,
        open: 9622.1,
        high: 9628.8,
        low: 9622.1,
        close: 9628.8,
        volume: 3.65199
      },
      {
        time: 1567362480000,
        open: 9628.8,
        high: 9628.8,
        low: 9628.7,
        close: 9628.75605418,
        volume: 0.0211
      }
    ];

    let expectedData = [
      {
        close: 9626.90964075,
        high: 9626.981274,
        low: 9626.9,
        open: 9626.981274,
        time: 1567361880000,
        volume: 1.3976485699999999
      },
      {
        time: 1567362000000,
        open: 9626.9,
        high: 9626.90963142,
        low: 9616.1,
        close: 9622.2,
        volume: 2.52501049
      },
      {
        time: 1567362300000,
        open: 9623.2,
        high: 9628.8,
        low: 9622.1,
        close: 9628.75605418,
        volume: 3.8814418300000004
      }
    ];
    let intervalRatio = 5;
    var result = ohlc_aggregate(
      data,
      /*intervalRatio=*/ intervalRatio,
      /*intervalInSeconds=*/ intervalRatio * 60
    );
    // console.log("result: ", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(expectedData);
  });
});


describe("#OHLC-Aggregate-1m-to-2m-ccxt-sample", function() {
  it("should convert 1m to 2m", function() {
    let data = [
      {
        time: 1563625680000,
        open: 0.00024824,
        high: 0.00024851,
        low: 0.00024798,
        close: 0.00024831,
        volume: 2264
      },
      {
        time: 1563625740000,
        open: 0.00024817,
        high: 0.00024832,
        low: 0.00024795,
        close: 0.00024828,
        volume: 3145
      },
      {
        time: 1563625800000,
        open: 0.00024824,
        high: 0.00024831,
        low: 0.00024789,
        close: 0.00024825,
        volume: 2956
      },
      {
        time: 1563625860000,
        open: 0.00024829,
        high: 0.00024841,
        low: 0.0002479,
        close: 0.00024841,
        volume: 3742
      },
      
    ];

    let expectedData = [
      {
        "open": 0.00024824,
        "close": 0.00024828,
        "low": 0.00024795,
        "high": 0.00024851,
        "volume": 5409,
        "time": 1563625680000
      },
      {
        "open": 0.00024824,
        "close": 0.00024841,
        "low": 0.00024789,
        "high": 0.00024841,
        "volume": 6698,
        "time": 1563625800000
      }
    ];
    let intervalRatio = 2;
    var result = ohlc_aggregate(
      data,
      /*intervalRatio=*/ intervalRatio,
      /*intervalInSeconds=*/ intervalRatio * 60
    );
    // console.log("result: ", JSON.stringify(result, null, 2));
    expect(result).to.deep.equal(expectedData);
  });
});

