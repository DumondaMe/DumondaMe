'use strict';

module.exports = [function () {
    var ctrl = this;

    ctrl.loadAddressBook = function () {
        delete ctrl.errorMessage;
        ctrl.contacts = ctrl.service.get({password: ctrl.password, username: ctrl.username}, function () {
            ctrl.finish();
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

