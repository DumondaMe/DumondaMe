'use strict';


module.exports = ['moment', 'DateTimePickerParseTime', function (moment, DateTimePickerParseTime) {
    var ctrl = this;

    ctrl.dateChanged = function () {
        var time = DateTimePickerParseTime.parseTime(ctrl.time);
        if (angular.isDate(ctrl.dateDay) && angular.isNumber(time.hour) && angular.isNumber(time.minute)) {
            ctrl.elyOnChange(moment().date(ctrl.dateDay.getDate()).month(ctrl.dateDay.getMonth()).year(ctrl.dateDay.getFullYear())
                .hour(time.hour).minute(time.minute).second(0));
        }
    };

    if (angular.isObject(ctrl.commands)) {
        ctrl.commands.dateDayChanged = function(dateDay) {
            ctrl.dateDay = dateDay;
            ctrl.dateChanged();
        };
    }

    ctrl.dateChanged();
}];
