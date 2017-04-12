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
                message: '=',
                invalidMessage: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/stepWriteCustomMessage/template.html'
        };
    }],
    name: 'elyInviteFriendsCustomMessageStep'
};
