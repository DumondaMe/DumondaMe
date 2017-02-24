'use strict';

module.exports = ['ElyModal', 'ImportGmxContacts', 'ImportWebDeContacts', 'SendInviteEmail',
    function (ElyModal, ImportGmxContacts, ImportWebDeContacts, SendInviteEmail) {
        var ctrl = this;
        ctrl.selectedAddresses = [];
        ctrl.successfullyImportedServices = [];
        ctrl.isSelectedAll = false;
        ctrl.contacts = {addresses: []};

        ctrl.sourceImportStarted = function () {
            ctrl.importStarted = true;
        };

        ctrl.sourceImportFinish = function (err, importSource) {
            ctrl.importStarted = false;
            if (err) {

            } else {
                ctrl.isSelectedAll = ctrl.contacts.addresses.length === ctrl.selectedAddresses.length;
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
                ctrl.isSelectedAll = ctrl.contacts.addresses.length === ctrl.selectedAddresses.length;
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

        ctrl.toggleAllEmailSelections = function () {
            ctrl.selectedAddresses = [];
            if (ctrl.isSelectedAll) {
                ctrl.contacts.addresses.forEach(function (address) {
                    ctrl.selectedAddresses.push(address);
                });
            }
        };

        ctrl.addEmails = function (emails) {
            ctrl.selectedAddresses = ctrl.selectedAddresses.concat(emails);
            ctrl.contacts.addresses = ctrl.contacts.addresses.concat(emails);
            ctrl.isSelectedAll = ctrl.contacts.addresses.length === ctrl.selectedAddresses.length;
            ctrl.showAddEmails = false;
        };

        ctrl.closeAddCustomEmails = function () {
            ctrl.showAddEmails = false;
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };
        var getEmails = function (selectedAddresses) {
            var addresses = [];
            selectedAddresses.forEach(function (selectedAddress) {
                addresses.push(selectedAddress.email);
            });
            return addresses;
        };

        ctrl.upload = function () {
            ctrl.uploadStarted = true;
            SendInviteEmail.save({emails: getEmails(ctrl.selectedAddresses)}, function () {
                ctrl.uploadStarted = false;
            }, function () {
                ctrl.uploadStarted = false;
            });
        };
    }];
