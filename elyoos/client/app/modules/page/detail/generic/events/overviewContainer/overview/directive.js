'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                isActual: '@',
                isAdmin: '='
            },
            templateUrl: 'app/modules/page/detail/generic/events/overviewContainer/overview/template.html'
        };
    }],
    name: 'elyPageDetailEventsOverview'
};
