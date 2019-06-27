'use strict';
module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                description: '@'
            },
            templateUrl: 'app/modules/common/expandText/template.html',
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                length: '@'
            }
        };
    }],
    name: 'elyExpandText'
};
