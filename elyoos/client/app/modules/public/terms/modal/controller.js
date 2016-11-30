'use strict';


module.exports = [ 'ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.closeTherms = function () {
            ElyModal.cancel();
        };
    }];
