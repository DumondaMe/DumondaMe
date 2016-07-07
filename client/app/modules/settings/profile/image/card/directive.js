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
            templateUrl: 'app/modules/settings/profile/image/card/template.html'
        };
    }],
    name: 'elySettingsProfileImageCard'
};
