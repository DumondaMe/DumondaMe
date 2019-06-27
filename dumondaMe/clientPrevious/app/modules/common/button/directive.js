'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/modules/common/button/template.html',
            scope: {},
            bindToController: {
                size: '@',
                icon: '@',
                orientation: '@',
                label: '@',
                isButtonSelected: '='
            },
            controller: require('./controller'),
            controllerAs: 'ctrl'
        };
    }],
    name: 'elyButton'
};
