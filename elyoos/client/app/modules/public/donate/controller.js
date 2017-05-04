'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.openBitcoinDonation = function () {
        ElyModal.show('DonateBitcoinCtrl', 'app/modules/public/donate/modal/bitcoin/template.html');
    };
}];
