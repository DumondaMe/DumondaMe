'use strict';

module.exports = ['ElyModal',
    function (ElyModal) {
        var ctrl = this;

        ctrl.data = {message: null, selectedAddresses: []};

        ctrl.close = function () {
            ElyModal.cancel();
        };
    }];
