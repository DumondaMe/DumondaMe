'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/iconButton/template.html',
            scope: {},
            bindToController: {
                label: '@',
                icon: '@',
                showLabelAlways: '=',
                elyDisabled: '='
            },
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyIconButton'
};
