'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: true,
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/noPinwall/writeBlog/template.html'
        };
    }],
    name: 'elyNoPinwallWriteBlogElement'
};
