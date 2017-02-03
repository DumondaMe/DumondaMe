'use strict';

module.exports = ['dateFormatter', function (dateFormatter) {
    var ctrl = this;

    ctrl.getTime = dateFormatter.getTime;
    ctrl.getEndDate = dateFormatter.getEndDate;
}];

