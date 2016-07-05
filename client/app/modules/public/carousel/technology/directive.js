'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/carousel/technology/template.html',
            controllerAs: 'ctrl',
            controller: function () {
            },
            bindToController: {}
        };
    }],
    name: 'elyCarouselTechnology'
};
