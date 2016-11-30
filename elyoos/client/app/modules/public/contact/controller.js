'use strict';


module.exports = [ 'ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.closeContact = function () {
            ElyModal.cancel();
        };
    }];
