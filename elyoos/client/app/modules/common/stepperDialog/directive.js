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
                showProgress: '=',
                disableDialogContent: '=',
                disableNavigation: '=',
                optionalFirst: '=',
                optionalFirstLabel: '@',
                finish: '=',
                finishLabel: '@',
                finishInfo: '=',
                command: '=',
                commandIsDisabled: '=',
                commandLabel: '=',
                abortCommand: '=',
            },
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyStepperDialog'
};
