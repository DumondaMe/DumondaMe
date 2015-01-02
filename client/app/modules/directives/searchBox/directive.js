'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                query: '='
            },
            templateUrl: 'app/modules/directives/searchBox/template.html'
        };
    }],
    name: 'elySearchBox'
};
