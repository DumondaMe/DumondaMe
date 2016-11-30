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
                pinwall: '='
            },
            templateUrl: 'app/modules/navigation/createPage/template.html'
        };
    }],
    name: 'elyNavCreatePage'
};
