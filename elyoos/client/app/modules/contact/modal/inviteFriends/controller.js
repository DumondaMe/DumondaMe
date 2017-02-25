'use strict';

module.exports = ['ElyModal', 'ImportGmxContacts', 'ImportWebDeContacts', 'SendInviteEmail', 'ArrayHelper',
    function (ElyModal, ImportGmxContacts, ImportWebDeContacts, SendInviteEmail, ArrayHelper) {
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
            return ArrayHelper.getIndex(selectedList, item, 'email') > -1;
        };

        ctrl.toggleEmail = function (item, selectedList) {
            var idx = ArrayHelper.getIndex(selectedList, item, 'email');
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
            ctrl.selectedAddresses = ArrayHelper.uniqueArray(ctrl.selectedAddresses.concat(emails), 'email');
            ctrl.contacts.addresses = ArrayHelper.uniqueArray(ctrl.contacts.addresses.concat(emails), 'email');
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
