'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {group: '='},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                title: '@',
                openEdit: '='
            },
            templateUrl: 'app/modules/settings/modal/overviewGroupSettings/group/template.html'
        };
    }],
    name: 'elySettingsPrivacyGroup'
};
