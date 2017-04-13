'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            require: '^elyStepperDialog',
            transclude: true,
            scope: {},
            controller: require('./controller.js'),
            link: require('./link.js'),
            controllerAs: 'ctrl',
            bindToController: {
                commandStepperDialog: '=',
                commandAbortStepperDialog: '=',
                commandStepperDialogLabel: '=',
                uploadRunning: '=',
                disableNavigation: '='
            },
            templateUrl: 'app/modules/settings/modal/setupAccount/contact/template.html'
        };
    }],
    name: 'elyTutorialContactStep'
};
