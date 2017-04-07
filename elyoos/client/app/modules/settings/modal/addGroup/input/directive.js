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
                nameChanged: '=',
                contactsVisible: '=',
                imageVisible: '=',
                pinwallVisible: '='
            },
            templateUrl: 'app/modules/settings/modal/addGroup/input/template.html'
        };
    }],
    name: 'elySettingAddGroupInput'
};
