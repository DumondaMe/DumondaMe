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

    this.formatRelativeTimes = function (dateValue) {
        return moment.unix(dateValue).fromNow(true);
    };

    this.formatExact = function (dateValue) {
        var endYesterday = moment().subtract(1, 'days').endOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isAfter(endYesterday)) {
            return dateValue.format('H:mm');
        }
        return dateValue.format('H:mm l');
    };

    this.getTime = function (dateValue, format) {
        if (angular.isString(format)) {
            return moment.unix(dateValue).format(format);
        }
        return moment.unix(dateValue).format('H:mm');
    };
}];
