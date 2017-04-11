'use strict';

module.exports = ['UnsubscribeInvitation', '$stateParams',
    function (UnsubscribeInvitation, $stateParams) {
        var ctrl = this;

        ctrl.email = $stateParams.email;
        ctrl.running = true;
        UnsubscribeInvitation.save({email: $stateParams.email}, function () {
            ctrl.running = false;
            ctrl.showSuccess = true;
        }, function () {
            ctrl.running = false;
            ctrl.showError = true;
        });
    }];
