'use strict';

module.exports = ['moment', 'elyHelper', function (moment, elyHelper) {

    var service = this;

    service.format = function (dateValue, format) {
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

    service.formatRelativeTimes = function (dateValue, addAgo) {
        if (elyHelper.isTrue(addAgo)) {
            return moment.unix(dateValue).fromNow();
        }
        return moment.unix(dateValue).fromNow(true);
    };

    service.formatExact = function (dateValue) {
        var endYesterday = moment().subtract(1, 'days').endOf('day');
        dateValue = moment.unix(dateValue);

        if (dateValue.isAfter(endYesterday)) {
            return dateValue.format('H:mm');
        }
        return dateValue.format('H:mm l');
    };

    service.getTime = function (dateValue, format) {
        if (angular.isString(format)) {
            return moment.unix(dateValue).format(format);
        }
        return moment.unix(dateValue).format('H:mm');
    };

    service.getEndDate = function (startDate, endDate) {
        if (moment.unix(startDate).isBetween(moment.unix(endDate).startOf('day'), moment.unix(endDate).endOf('day'))) {
            return service.getTime(endDate, 'LT');
        }
        return service.getTime(endDate, 'l LT');
    };
}];
