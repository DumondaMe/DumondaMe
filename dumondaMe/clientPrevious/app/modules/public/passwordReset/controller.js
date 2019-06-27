'use strict';

module.exports = ['ElyModal', '$stateParams',
    function (ElyModal, $stateParams) {
        var ctrl = this;

        ctrl.openPasswordReset = function () {
            ElyModal.show('ResetPasswordCtrl', 'app/modules/public/passwordReset/modal/template.html',
                {linkId: $stateParams.linkId});
        };
        ctrl.openPasswordReset();
    }];
