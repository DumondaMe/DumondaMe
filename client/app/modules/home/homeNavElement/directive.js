'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@',
                navTo: '@',
                imageUrl: '@',
                eventDescription: '='
            },
            templateUrl: 'app/modules/home/homeNavElement/template.html'
        };
    }],
    name: 'elyHomeNavElement'
};
