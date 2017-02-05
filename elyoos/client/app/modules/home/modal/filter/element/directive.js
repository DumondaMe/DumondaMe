'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                icon: '@',
                description: '@',
                element: '=',
                elyOnChange: '='
            },
            templateUrl: 'app/modules/home/modal/filter/element/template.html'
        };
    }],
    name: 'elyHomeFilterElement'
};
