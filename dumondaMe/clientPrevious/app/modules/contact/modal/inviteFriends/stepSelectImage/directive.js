'use strict';

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            require: '^elyStepperDialog',
            transclude: true,
            scope: {},
            controller: require('./../../../../settings/modal/setupAccount/profileImage/controller'),
            controllerAs: 'ctrl',
            bindToController: {
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/stepSelectImage/template.html'
        };
    }],
    name: 'elyInviteFriendsProfileImageStep'
};
