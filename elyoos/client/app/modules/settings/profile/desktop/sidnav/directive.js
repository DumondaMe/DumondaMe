'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function () {
            },
            controllerAs: 'ctrl',
            bindToController: {
                profile: '='
            },
            templateUrl: 'app/modules/settings/profile/desktop/sidnav/template.html'
        };
    }],
    name: 'elySettingsProfileSidnav'
};
