'use strict';

let config = '';

module.exports = {
    getConfig: function () {
        return config;
    },
    config: function (conf) {

        config = conf;
    }
};
