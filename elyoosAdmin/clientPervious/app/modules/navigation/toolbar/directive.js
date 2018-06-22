'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/navigation/toolbar/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js')
        };
    }],
    name: 'elyToolbar'
};
