'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;
    ctrl.actualScreen = 0;

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
        ElyModal.show('RegisterCtrl', 'app/modules/public/register/template.html', {})
            .then(function (resp) {

            });
    };
}];
