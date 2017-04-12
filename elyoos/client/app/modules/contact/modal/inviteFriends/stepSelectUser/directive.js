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
                commandIsDisabled: '=',
                disableNavigation: '=',
                importStarted: '=',
                selectedAddresses: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/stepSelectUser/template.html'
        };
    }],
    name: 'elyInviteFriendsSelectStep'
};
