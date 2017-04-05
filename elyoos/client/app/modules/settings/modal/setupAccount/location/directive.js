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
                uploadRunning: '='
            },
            templateUrl: 'app/modules/settings/modal/setupAccount/location/template.html'
        };
    }],
    name: 'elyTutorialLocationStep'
};
