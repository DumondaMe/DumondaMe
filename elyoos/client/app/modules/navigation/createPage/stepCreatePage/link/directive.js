'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
            },
            templateUrl: 'app/modules/navigation/createPage/stepCreatePage/link/template.html'
        };
    }],
    name: 'elyCreatePageStepLink'
};