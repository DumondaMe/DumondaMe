'use strict';

module.exports = ['moment', function (moment) {

    this.format = function (dateValue, format) {
        var endYesterday = moment().subtract(1, 'days').endOf('day'),
            startYesterday = moment().subtract(1, 'days').startOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isBetween(startYesterday, endYesterday)) {
            return 'Gestern';
        }

        if (dateValue.isAfter(endYesterday)) {
            return 'Heute';
        }
        if (format) {
            return dateValue.format(format);
        }
        return dateValue.format('l');
    };

    this.formatRelativeTimes =  function (dateValue, format) {
        var startYesterday = moment().subtract(1, 'days').startOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isAfter(startYesterday)) {
            return dateValue.fromNow();
        }
        if (format) {
            return dateValue.format(format);
        }
        return dateValue.format('l');
    };

    this.formatExact = function (dateValue) {
        var endYesterday = moment().subtract(1, 'days').endOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isAfter(endYesterday)) {
            return dateValue.format('H:mm');
        }
        return dateValue.format('H:mm l');
    };

    return this;
}];
