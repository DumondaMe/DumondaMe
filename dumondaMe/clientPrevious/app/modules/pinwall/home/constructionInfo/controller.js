'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.openInviteFriendsDialog = function () {
        ElyModal.show('InviteFriendsCtrl', 'app/modules/contact/modal/inviteFriends/template.html');
    };
}];

