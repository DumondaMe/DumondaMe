'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/public/donate/template.html',
            controllerAs: 'ctrl',
            controller: require('./controller.js'),
            bindToController: {showPreviewImage: '='}
        };
    }],
    name: 'elyDonate'
};
