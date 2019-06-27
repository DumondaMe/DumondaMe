'use strict';

module.exports = ['ElyModal', '$state', function (ElyModal, $state) {
    var ctrl = this;

    ctrl.$state = $state;

    ctrl.openContact = function () {
        ElyModal.show('ContactCtrl', 'app/modules/public/contact/template.html', {});
    };
}];
