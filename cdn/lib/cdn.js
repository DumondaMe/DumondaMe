'use strict';

var logger = require('./logging').getLogger(__filename);
var config = '';

var cdn = function () {
    return {
        getConfig: function () {
            return config;
        },
        config: function (conf) {

            config = conf;
        }
    };
};

module.exports = cdn();
