'use strict';

module.exports = ['ElyModal', '$mdMedia', function (ElyModal, $mdMedia) {
    var ctrl = this;
    ctrl.actualScreen = 0;
    ctrl.$mdMedia = $mdMedia;

    ctrl.openAgb = function () {
        ElyModal.show('ThermsCtrl', 'app/modules/public/terms/modal/template.html', {});
    };

    ctrl.openContact = function () {
        ElyModal.show('PublicContactCtrl', 'app/modules/public/contact/template.html', {});
    };

    ctrl.onSwipeDown = function () {
        if (ctrl.actualScreen > 0) {
            ctrl.actualScreen--;
        }
    };

    ctrl.onSwipeUp = function () {
        if (ctrl.actualScreen < 2) {
            ctrl.actualScreen++;
        }
    };

    ctrl.startRegister = function () {
        ElyModal.show('RegisterCtrl', 'app/modules/public/register/template.html', {});
    };
}];
