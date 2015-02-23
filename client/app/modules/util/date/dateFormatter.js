'use strict';

module.exports = ['moment', function (moment) {

    this.format = function (dateValue) {
        var endYesterday = moment().subtract(1, 'days').endOf('day'),
            startYesterday = moment().subtract(1, 'days').startOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isBetween(startYesterday, endYesterday)) {
            return 'Gestern';
        }

        if (dateValue.isAfter(endYesterday)) {
            return 'Heute';
        }
        return dateValue.format('l');
    };

    return this;
}];
