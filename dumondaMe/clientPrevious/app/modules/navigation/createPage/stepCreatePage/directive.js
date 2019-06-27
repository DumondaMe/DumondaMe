'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            require: '^elyStepperDialog',
            transclude: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
            },
            templateUrl: 'app/modules/navigation/createPage/stepCreatePage/template.html'
        };
    }],
    name: 'elyCreatePageStep'
};
