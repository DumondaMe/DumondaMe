'use strict';

module.exports = ['dateFormatter',
    function (dateFormatter) {
        var ctrl = this;

        ctrl.getFormattedDate = dateFormatter.formatRelativeTimes;
    }];


