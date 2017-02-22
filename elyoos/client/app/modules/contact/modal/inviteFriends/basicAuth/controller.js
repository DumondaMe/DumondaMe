'use strict';

module.exports = ['SourceImportModification', function (SourceImportModification) {
    var ctrl = this;

    ctrl.loadAddressBook = function () {
        delete ctrl.errorMessage;
        ctrl.basicAuthContacts = ctrl.service.get({password: ctrl.password, username: ctrl.username}, function () {
            SourceImportModification.addSourceDescription(ctrl.basicAuthContacts.addresses, ctrl.serviceName);
            ctrl.contacts.addresses = ctrl.contacts.addresses.concat(ctrl.basicAuthContacts.addresses);
            ctrl.finish(ctrl.serviceName);
        }, function (resp) {
            if (resp.status === 401) {
                ctrl.errorMessage = 'Passwort oder E-Mail-Addresse ist nicht korrekt.';
            } else {
                ctrl.errorMessage = 'Es ist ein unbekannter Fehler aufgetreten. ' +
                    'Versuche es später noch einmal oder erfasse eine Fehlermeldung.';
            }
        });
    };
}];

