'use strict';

var logger = require('./logging').getLogger(__filename);
var config = '';

module.exports = {
    getConfig: function () {
        return config;
    },
    config: function (conf) {
        config = conf;
    }
};
