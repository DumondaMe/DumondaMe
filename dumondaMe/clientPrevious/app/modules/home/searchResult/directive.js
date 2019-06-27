'use strict';

module.exports = {
    directive: [ function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                searchResult: '='
            },
            templateUrl: 'app/modules/home/searchResult/template.html'
        };
    }],
    name: 'elyHomeSearchResult'
};
