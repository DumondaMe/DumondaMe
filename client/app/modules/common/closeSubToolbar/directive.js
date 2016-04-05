'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/common/closeSubToolbar/template.html',
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                description: '@',
                onClose: '='
            }
        };
    }],
    name: 'elyCloseSubToolbar'
};
