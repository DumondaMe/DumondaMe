'use strict';

module.exports = ['ContactStatisticTypes', 'ElyModal', 'Contact', 'errorToast',
    function (ContactStatisticTypes, ElyModal, Contact, errorToast) {
        var ctrl = this;

        ctrl.types = ContactStatisticTypes.getTypes(ctrl.previousType);
        if (ctrl.types.length > 0) {
            ctrl.selectedType = ctrl.types[0];
        }

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.accept = function (mode) {
            ctrl.uploadStarted = true;
            Contact.save({
                contactIds: [ctrl.contactId],
                mode: mode,
                description: ctrl.selectedType
            },function () {
                ElyModal.hide(ctrl.selectedType);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];
