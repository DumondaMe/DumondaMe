'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: {
                state: '@',
                baseState: '@',
                icon: '@',
                description: '@',
                count: '=',
                onClick: '='
            },
            templateUrl: 'app/modules/navigation/leftNav/element/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js')
        };
    }],
    name: 'elyLeftNavElement'
};
