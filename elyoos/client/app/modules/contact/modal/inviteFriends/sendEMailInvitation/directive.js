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
                addresses: '=',
                cancel: '='
            },
            templateUrl: 'app/modules/contact/modal/inviteFriends/sendEMailInvitation/template.html'
        };
    }],
    name: 'elySendEmailInvitation'
};
