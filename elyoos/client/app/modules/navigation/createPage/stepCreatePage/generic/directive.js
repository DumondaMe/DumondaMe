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
            templateUrl: 'app/modules/navigation/createPage/stepCreatePage/generic/template.html'
        };
    }],
    name: 'elyCreatePageStepGeneric'
};
