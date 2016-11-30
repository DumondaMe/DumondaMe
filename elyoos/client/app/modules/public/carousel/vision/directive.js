'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/carousel/vision/template.html',
            controllerAs: 'ctrl',
            controller: function () {
            },
            bindToController: {}
        };
    }],
    name: 'elyCarouselVision'
};
