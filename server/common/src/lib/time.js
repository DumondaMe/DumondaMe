"use strict";

var moment = require('moment');

var getNowUtcTimestamp = function () {
    return Math.floor(moment.utc().valueOf() / 1000);
};

module.exports = {
    getNowUtcTimestamp: getNowUtcTimestamp
};