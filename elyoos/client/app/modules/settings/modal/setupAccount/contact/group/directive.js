'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                statistics: '='
            },
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
                showAddGroup: '=',
                selectedGroup: '=',
                uploadRunning: '=',
                disableNavigation: '='
            },
            templateUrl: 'app/modules/settings/modal/setupAccount/contact/group/template.html'
        };
    }],
    name: 'elyTutorialContactGroup'
};
