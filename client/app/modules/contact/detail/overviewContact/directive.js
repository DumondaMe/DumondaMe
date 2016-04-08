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
                commands: '=',
                name: '@',
                title: '@',
                showTitle: '=',
                loadFinish: '='
            },
            templateUrl: 'app/modules/contact/detail/overviewContact/template.html'
        };
    }],
    name: 'elyUserDetailOverviewContact'
};
