'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            bindToController: true,
            controller: function () {
            },
            controllerAs: 'ctrl',
            templateUrl: 'app/modules/pinwall/noPinwall/feedback/template.html'
        };
    }],
    name: 'elyNoPinwallFeedbackElement'
};
