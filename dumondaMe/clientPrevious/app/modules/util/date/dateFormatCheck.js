'use strict';

module.exports = ['moment', function (moment) {

    this.isDateValid = function (date) {
        return moment(date, 'l', moment.locale(), true).isValid();
    };

    this.getDateExample = function () {
        var unixTimestamp = 385974036;
        return moment.unix(unixTimestamp).format('l');
    };

}];
