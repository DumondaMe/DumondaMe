'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.close = function () {
        ElyModal.cancel();
    };
}];
