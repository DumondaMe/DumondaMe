'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                query: '=',
                getQuerySuggestion: '=',
                getQuery: '='
            },
            templateUrl: 'app/modules/directives/searchBox/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elySearchBox'
};
