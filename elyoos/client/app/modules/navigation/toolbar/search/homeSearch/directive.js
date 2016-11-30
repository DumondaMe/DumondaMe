'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/navigation/toolbar/search/homeSearch/template.html',
            scope: {},
            controllerAs: 'ctrl',
            bindToController: {
                commands: '=',
                onClose: '=',
                requestStarted: '&'
            },
            controller: require('./controller.js')
        };
    }],
    name: 'elyToolbarHomeSearch'
};
