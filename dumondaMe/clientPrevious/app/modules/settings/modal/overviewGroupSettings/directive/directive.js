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
            },
            templateUrl: 'app/modules/settings/modal/overviewGroupSettings/directive/template.html'
        };
    }],
    name: 'elyOverviewGroupSettings',
    directiveContent: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                notHideFinish: '=',
                instantUpdate: '=',
                uploadStartedEvent: '='
            },
            templateUrl: 'app/modules/settings/modal/overviewGroupSettings/directive/templateContent.html'
        };
    }],
    nameContent: 'elyContentOverviewGroupSettings'
};
