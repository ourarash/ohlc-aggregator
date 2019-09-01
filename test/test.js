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
      /*durationInSeconds=*/ 5 * 60
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
  it("should return an array of length 1 if input is of length 2 and one is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ 5 * 60
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
  it("should return an array of length 2 if input is of length 3 and middle one is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ 5 * 60
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

  it("should return an array of length 1 if input is of length 3 and last one is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ 5 * 60
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

  it("should return an array of length 1 if input is of length 3 and first one is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ 5 * 60
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

  it("should return an array of length 1 if input is of length 3 and none is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ 5 * 60
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
  it("should return an array of length 2 if input is of length 10 and first one is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ 5 * 60
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
      /*durationInSeconds=*/ 5 * 60
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
      /*durationInSeconds=*/ 5 * 60
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

describe("#OHLC-Aggregate-1m-to-5m", function() {
  basicTests();
  lengthTwoTests();
  lengthThreeTests();

  lengthTenTests();
});

describe("#OHLC-Aggregate-1m-to-10m", function() {
  it("should return an array of length 2 if input is of length 10 and first one is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ intervalRatio * 60
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
  it("should return an array of length 2 if input is of length 8 and first one is divisable by durationInSeconds", function() {
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
      /*durationInSeconds=*/ intervalRatio * 60 * 60
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
