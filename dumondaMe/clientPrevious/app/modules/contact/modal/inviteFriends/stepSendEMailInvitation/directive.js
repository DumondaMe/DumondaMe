'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            require: '^elyStepperDialog',
            transclude: true,
            scope: {},
            controller: require('./controller.js'),
            controllerAs: 'ctrl',
            bindToController: {
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/stepSendEMailInvitation/template.html'
        };
    }],
    name: 'elyInviteFriendsSendEmailInvitation'
};
