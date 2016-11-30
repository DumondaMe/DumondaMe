'use strict';

module.exports = ['ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.finish = function (data) {
            ElyModal.hide(data);
        };

        ctrl.abort = function () {
            ElyModal.cancel();
        };
    }];

