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
                addresses: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/stepSendEMailInvitation/template.html'
        };
    }],
    name: 'elyInviteFriendsSendEmailInvitation'
};
