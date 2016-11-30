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
                profile: '='
            },
            templateUrl: 'app/modules/settings/profile/image/template.html'
        };
    }],
    name: 'elySettingsProfileImage'
};
