'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            require: '^elyStepperDialog',
            transclude: true,
            scope: {},
            controller: function () {
            },
            link: require('./link.js'),
            controllerAs: 'ctrl',
            bindToController: {
                uploadRunning: '=',
                disableNavigation: '='
            },
            templateUrl: 'app/modules/settings/modal/setupAccount/location/template.html'
        };
    }],
    name: 'elyTutorialLocationStep'
};
