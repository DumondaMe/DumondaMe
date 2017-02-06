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
                elyOnClick: '=',
                icon: '@',
                description: '@'
            },
            templateUrl: 'app/modules/navigation/createPage/element/template.html'
        };
    }],
    name: 'elyNavCreatePageElement'
};
