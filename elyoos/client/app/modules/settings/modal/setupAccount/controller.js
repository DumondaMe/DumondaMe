'use strict';

module.exports = ['ElyModal', 'FinishSetupAccount', 'errorToast',
    function (ElyModal, FinishSetupAccount, errorToast) {
        var ctrl = this;

        ctrl.close = function () {
            ElyModal.cancel();
        };

        ctrl.finish = function () {
            FinishSetupAccount.save({}, function () {
                ElyModal.hide();
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
            });
        };
    }];
