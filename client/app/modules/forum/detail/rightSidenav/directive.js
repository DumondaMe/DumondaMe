'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                detail: '='
            },
            templateUrl: 'app/modules/forum/detail/rightSidenav/template.html'
        };
    }],
    name: 'elyQuestionRightSidenav'
};
