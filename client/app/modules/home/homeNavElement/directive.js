'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                navTo: '@',
                imageUrl: '@'
            },
            templateUrl: 'app/modules/home/homeNavElement/template.html'
        };
    }],
    name: 'elyHomeNavElement'
};
