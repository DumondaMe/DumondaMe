"use strict";

let moment = require('moment');

let getNowUtcTimestamp = function () {
    return Math.floor(moment.utc().valueOf() / 1000);
};

module.exports = {
    getNowUtcTimestamp: getNowUtcTimestamp
};
