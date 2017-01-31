'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function () {
            },
            controllerAs: 'ctrl',
            bindToController: {isAdmin: '=', commands: '=', addresses: '='},
            templateUrl: 'app/modules/page/detail/generic/events/overviewContainer/template.html'
        };
    }],
    name: 'elyPageDetailEventsOverviewContainer'
};
