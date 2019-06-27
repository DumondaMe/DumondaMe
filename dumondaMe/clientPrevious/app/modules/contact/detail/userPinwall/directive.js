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
                userName: '=',
                showTitle: '=',
                commands: '=',
                breakpoint: '@'
            },
            templateUrl: 'app/modules/contact/detail/userPinwall/template.html'
        };
    }],
    name: 'elyUserDetailPinwall'
};
