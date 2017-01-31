'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/dateTimePicker/template.html',
            scope: {},
            bindToController: {
                dateDay: '=',
                time: '@',
                minDate: '=',
                formObject: '=',
                formName: '@',
                customErrorMessage: '@',
                label: '@',
                elyOnChange: '=',
                elyDisabled: '=',
                commands: '='
            },
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyDateTimePicker'
};
