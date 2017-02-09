'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {addresses: '='},
            controller: require('./controller'),
            controllerAs: 'ctrl',
            bindToController: {},
            templateUrl: 'app/modules/page/detail/generic/map/template.html'
        };
    }],
    name: 'elyPageDetailMapGeneric'
};
