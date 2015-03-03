'use strict';
var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                totalItems: '&',
                itemsPerPage: '@',
                getPaginationSet: '='
            },
            templateUrl: 'app/modules/directives/paginationNextPrevious/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyPaginationNextPrevious'
};
