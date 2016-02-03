'use strict';

module.exports = ['ContactStatisticTypes', '$mdDialog', 'Contact', 'errorToast',
    function (ContactStatisticTypes, $mdDialog, Contact, errorToast) {
        var ctrl = this;

        ctrl.types = ContactStatisticTypes.getTypes(ctrl.previousType);
        if (ctrl.types.length > 0) {
            ctrl.selectedType = ctrl.types[0];
        }

        ctrl.cancel = function () {
            $mdDialog.cancel();
        };

        ctrl.accept = function () {
            ctrl.uploadStarted = true;
            Contact.save({
                contactIds: [ctrl.contactId],
                mode: 'changeState',
                description: ctrl.selectedType
            },function () {
                $mdDialog.hide(ctrl.selectedType);
            }, function () {
                errorToast.showError('Es ist ein Fehler aufgetretten!');
                ctrl.uploadStarted = false;
            });
        };

    }];

