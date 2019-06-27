'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/modules/common/closeSubToolbar/template.html',
            controller: function () {
            },
            controllerAs: 'ctrl',
            bindToController: {
                description: '@',
                onClose: '='
            }
        };
    }],
    name: 'elyCloseSubToolbar'
};
