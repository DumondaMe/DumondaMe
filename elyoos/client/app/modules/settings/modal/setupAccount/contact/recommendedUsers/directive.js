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
                uploadRunning: '=',
                selectedGroup: '=',
                isActive: '='
            },
            templateUrl: 'app/modules/settings/modal/setupAccount/contact/recommendedUsers/template.html'
        };
    }],
    name: 'elyTutorialContactRecommendedUsers'
};
