'use strict';

module.exports = ['ElyModal', 'ImportGmxContacts', 'ImportWebDeContacts',
    function (ElyModal, ImportGmxContacts, ImportWebDeContacts) {
        var ctrl = this;
        ctrl.selectedAddresses = [];
        ctrl.successfullyImportedServices = [];
        ctrl.emailAddressIsValid = false;
        ctrl.contacts = {addresses: []};
        ctrl.sourceImportStarted = function () {
            ctrl.importStarted = true;
        };

        ctrl.sourceImportFinish = function (err, importSource) {
            ctrl.importStarted = false;
            if (err) {

            } else {
                ctrl.successfullyImportedServices.push(importSource);
            }
        };

        ctrl.openBasicAuthGmx = function () {
            ctrl.basicAuthName = 'GMX';
            ctrl.basicAuthService = ImportGmxContacts;
            ctrl.showBasicAuth = true;
        };

        ctrl.openBasicAuthWebDe = function () {
            ctrl.basicAuthName = 'WEB.DE';
            ctrl.basicAuthService = ImportWebDeContacts;
            ctrl.showBasicAuth = true;
        };

        ctrl.closeBasicAuth = function (importSource) {
            ctrl.showBasicAuth = false;
            if (angular.isString(importSource)) {
                ctrl.successfullyImportedServices.push(importSource);
            }
        };

        ctrl.emailExists = function (item, selectedList) {
            return selectedList.indexOf(item) > -1;
        };

        ctrl.toggleEmail = function (item, selectedList) {
            var idx = selectedList.indexOf(item);
            if (idx > -1) {
                selectedList.splice(idx, 1);
            }
            else {
                selectedList.push(item);
            }
        };

        ctrl.addEmails = function (emails) {
            ctrl.contacts.addresses = ctrl.contacts.addresses.concat(emails);
            ctrl.showAddEmails = false;
        };

        ctrl.closeAddCustomEmails = function () {
            ctrl.showAddEmails = false;
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.accept = function (mode) {

        };
    }];
