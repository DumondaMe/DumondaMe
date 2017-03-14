'use strict';

module.exports = ['ElyModal', function (ElyModal) {
    var ctrl = this;

    ctrl.openContact = function () {
        ElyModal.show('ContactCtrl', 'app/modules/public/contact/template.html', {});
    };
}];
