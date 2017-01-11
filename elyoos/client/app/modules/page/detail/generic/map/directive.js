'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller'),
            controllerAs: 'ctrl',
            bindToController: {
                addresses: '='
            },
            templateUrl: 'app/modules/page/detail/generic/map/template.html'
        };
    }],
    name: 'elyPageDetailMapGeneric'
};
