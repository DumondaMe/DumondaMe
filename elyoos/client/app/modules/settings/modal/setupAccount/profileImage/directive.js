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
            },
            templateUrl: 'app/modules/settings/modal/setupAccount/profileImage/template.html'
        };
    }],
    name: 'elyTutorialProfileImageStep'
};
