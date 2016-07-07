'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: require('./../../settingsOverview/controller.js'),
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'app/modules/settings/profile/desktop/settingsOverview/template.html'
        };
    }],
    name: 'elySettingsOverviewDesktop'
};
