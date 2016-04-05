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
                service: '=',
                name: '@',
                title: '@',
                loadFinish: '='
            },
            templateUrl: 'app/modules/contact/detail/overviewContact/template.html'
        };
    }],
    name: 'elyUserDetailOverviewContact'
};
