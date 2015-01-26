'use strict';

var moment = require('moment');

module.exports = function () {
    moment.locale('de');
    return moment;
};
