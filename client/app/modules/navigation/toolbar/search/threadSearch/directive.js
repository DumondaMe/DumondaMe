'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/navigation/toolbar/search/threadSearch/template.html',
            scope: {},
            controllerAs: 'ctrl',
            bindToController: {
                commands: '='
            },
            controller: require('./../contactSearch/controller.js')
        };
    }],
    name: 'elyToolbarThreadSearch'
};
