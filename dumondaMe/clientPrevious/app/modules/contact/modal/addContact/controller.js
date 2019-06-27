'use strict';

module.exports = ['ContactGroupStatistic', 'ElyModal', 'Contact', 'errorToast',
    function (ContactGroupStatistic, ElyModal, Contact, errorToast) {
        var ctrl = this;

        ctrl.groups = ContactGroupStatistic.getGroups(ctrl.previousType);
        if (ctrl.groups.length > 0) {
            ctrl.selectedType = ctrl.groups[0];
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
