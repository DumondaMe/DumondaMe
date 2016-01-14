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
            templateUrl: 'app/modules/common/searchBox/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elySearchBox'
};
