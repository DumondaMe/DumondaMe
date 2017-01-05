"use strict";

let RateLimit = require('express-rate-limit');

let getRate = function (params) {
    return new RateLimit(params);
};

module.exports = {
    getRate: getRate
};
