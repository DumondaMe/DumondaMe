"use strict";

var RateLimit = require('express-rate-limit');

var getRate = function (params) {
    return new RateLimit(params);
};

module.exports = {
    getRate: getRate
};
