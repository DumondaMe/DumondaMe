'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'app/modules/common/stepperDialog/template.html',
            scope: {},
            bindToController: {

            },
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyStepperDialog'
};
