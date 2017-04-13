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
                disabledUpload: '=',
                finishEvent: '=',
                uploadStarted: '='
            },
            templateUrl: 'app/modules/settings/modal/addGroup/templateDirective.html'
        };
    }],
    name: 'elySettingAddGroup'
};
