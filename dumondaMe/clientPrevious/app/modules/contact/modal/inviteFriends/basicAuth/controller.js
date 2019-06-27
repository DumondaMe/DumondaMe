'use strict';

module.exports = ['SourceImportModification', 'ArrayHelper', 'StepperDialogCommandHandler',
    function (SourceImportModification, ArrayHelper, StepperDialogCommandHandler) {
        var ctrl = this;

        ctrl.loadAddressBook = function () {
            delete ctrl.errorMessage;
            ctrl.importStarted = true;
            StepperDialogCommandHandler.showProgressBar();
            ctrl.basicAuthContacts = ctrl.service.get({password: ctrl.password, username: ctrl.username}, function () {
                SourceImportModification.addSourceDescription(ctrl.basicAuthContacts.addresses, ctrl.serviceName);
                ctrl.contacts.addresses = ArrayHelper.uniqueArray(ctrl.contacts.addresses.concat(ctrl.basicAuthContacts.addresses), 'email');
                ctrl.importStarted = false;
                ctrl.finish(ctrl.serviceName);
            }, function (resp) {
                ctrl.importStarted = false;
                StepperDialogCommandHandler.hideProgressBar();
                if (resp.status === 401) {
                    ctrl.errorMessage = 'Passwort oder E-Mail-Addresse ist nicht korrekt.';
                } else {
                    ctrl.errorMessage = 'Es ist ein unbekannter Fehler aufgetreten. ' +
                        'Versuche es später noch einmal oder erfasse eine Fehlermeldung.';
                }
            });
        };

        ctrl.inputChanged = function () {
            if(ctrl.basicAuthForm.$valid) {
                StepperDialogCommandHandler.enableButtonCommand();
            } else {
                StepperDialogCommandHandler.disableButtonCommand();
            }
        };

        StepperDialogCommandHandler.showButtonCommand(ctrl.finish, ctrl.loadAddressBook, 'Adressbuch laden');
    }];

