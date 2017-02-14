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
                commands: '=',
                profile: '='
            },
            templateUrl: 'app/modules/settings/profile/desktop/template.html'
        };
    }],
    name: 'elySettingsProfileDesktop'
};
