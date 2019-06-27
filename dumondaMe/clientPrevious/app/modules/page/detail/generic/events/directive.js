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
                pageId: '=',
                addresses: '=',
                hasEvents: '=',
                isAdmin: '='
            },
            templateUrl: 'app/modules/page/detail/generic/events/template.html'
        };
    }],
    name: 'elyPageDetailEvents'
};
