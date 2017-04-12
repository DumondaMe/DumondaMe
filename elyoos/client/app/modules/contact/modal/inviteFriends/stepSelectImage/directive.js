'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            require: '^elyStepperDialog',
            transclude: true,
            scope: {},
            controller: require('./controller.js'),
            link: require('./link.js'),
            controllerAs: 'ctrl',
            bindToController: {
                commandStepperDialog: '=',
                commandAbortStepperDialog: '=',
                commandStepperDialogLabel: '=',
                uploadRunning: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/stepSelectImage/template.html'
        };
    }],
    name: 'elyInviteFriendsProfileImageStep'
};