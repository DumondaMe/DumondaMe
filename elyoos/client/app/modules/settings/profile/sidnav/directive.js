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
                profile: '=',
                showPages: '=',
                showContacts: '='
            },
            templateUrl: 'app/modules/settings/profile/sidnav/template.html'
        };
    }],
    name: 'elySettingsProfileSidnav'
};
