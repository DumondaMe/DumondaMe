'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/navigation/toolbar/search/contactSearch/template.html',
            scope: {},
            controllerAs: 'ctrl',
            bindToController: {
                commands: '=',
                requestStarted: '&'
            },
            controller: require('./controller.js')
        };
    }],
    name: 'elyToolbarContactSearch'
};
