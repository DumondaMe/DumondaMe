'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.openRegister = function () {
        ElyModal.show('RegisterCtrl', 'app/modules/public/register/template.html', {});
    };

    ctrl.openLogin = function () {
        ElyModal.show('LoginCtrl', 'app/modules/public/login/template.html', {});
    };
}];
