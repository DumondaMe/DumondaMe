'use strict';

var controller = require('./controller.js');

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                isReadonly: '@',
                isSmall: '@',
                numberOfSelectedStars: '=',
                numberOfSelectedStarsReadonly: '&'
            },
            templateUrl: 'app/modules/directives/starRating/template.html',
            controller: controller.directiveCtrl()
        };
    }],
    name: 'elyStarRating'
};
