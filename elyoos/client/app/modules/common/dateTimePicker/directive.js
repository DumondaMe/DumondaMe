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
                resultDate: '=',
                time: '@',
                minDate: '=',
                messageError: '=',
                formName: '@',
                label: '@'
            },
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyDateTimePicker'
};
