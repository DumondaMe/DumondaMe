'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/navigation/toolbar/search/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js'),
            bindToController: {
                searchOpen: '&',
                searchClose: '&'
            }
        };
    }],
    name: 'elyToolbarSearch'
};
