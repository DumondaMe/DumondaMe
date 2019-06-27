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
                addGroup: '=',
                groupNameCheckEvent: '=',
                finishEvent: '='
            },
            templateUrl: 'app/modules/settings/modal/addGroup/templateDirective.html'
        };
    }],
    name: 'elySettingAddGroup'
};
