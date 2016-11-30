'use strict';

module.exports = ['moment', 'DateFormatCheckService', function (moment, DateFormatCheckService) {

    this.convertDisplayToInteger = function (dateValue) {
        if(DateFormatCheckService.isDateValid(dateValue)) {
            return moment.utc(dateValue, 'l', moment.locale(), true).valueOf() / 1000;
        }
    };
}];
