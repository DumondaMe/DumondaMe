'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/carousel/meaning/template.html',
            controllerAs: 'ctrl',
            controller: function () {
            },
            bindToController: {}
        };
    }],
    name: 'elyCarouselMeaning'
};
