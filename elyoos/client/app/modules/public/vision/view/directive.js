'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/vision/view/template.html',
            controllerAs: 'ctrl',
            controller: function () {}
        };
    }],
    name: 'elyPublicVision'
};
