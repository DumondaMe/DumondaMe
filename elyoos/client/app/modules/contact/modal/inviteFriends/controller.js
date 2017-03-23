'use strict';

var maxSelectedLength = 1000;

module.exports = ['ElyModal', 'ImportGmxContacts', 'ImportWebDeContacts', 'SendInviteEmail', 'ArrayHelper', 'InviteFriendsSelectedEMails', 'errorToast',
    function (ElyModal, ImportGmxContacts, ImportWebDeContacts, SendInviteEmail, ArrayHelper, InviteFriendsSelectedEMails, errorToast) {
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
                errorToast.showError(importSource + " konnte nicht importiert werden");
            } else {
                ctrl.isSelectedAll = ctrl.contacts.addresses.length === ctrl.selectedAddresses.length;
                ctrl.successfullyImportedServices.push(importSource);
                ctrl.showOnlySelected = false;
                ctrl.contactsToShow = ctrl.contacts.addresses;
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
                ctrl.showOnlySelected = false;
                ctrl.contactsToShow = ctrl.contacts.addresses;
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
                if (selectedList.length < maxSelectedLength) {
                    selectedList.push(item);
                } else {
                    ctrl.maxSelected = true;
                    errorToast.showWarning('Es können nicht mehr als 1000 Adressen ausgewählt werden.');
                }
            }
            ctrl.isSelectedAll = selectedList.length === ctrl.contacts.addresses.length || selectedList.length === maxSelectedLength;

            if (selectedList.length === 0) {
                ctrl.showOnlySelected = false;
                ctrl.contactsToShow = ctrl.contacts.addresses;
            }
        };

        ctrl.toggleAllEmailSelections = function () {
            ctrl.selectedAddresses = [];
            if (ctrl.isSelectedAll) {
                ctrl.contacts.addresses.forEach(function (address) {
                    if (ctrl.selectedAddresses.length < maxSelectedLength) {
                        ctrl.selectedAddresses.push(address);
                    }
                });
                if (ctrl.contacts.addresses.length > ctrl.selectedAddresses.length) {
                    ctrl.maxSelected = true;
                }
            } else {
                ctrl.maxSelected = false;
            }
        };

        ctrl.onlySelectedChanged = function () {
            if (ctrl.showOnlySelected) {
                ctrl.contactsToShow = ctrl.selectedAddresses;
            } else {
                ctrl.contactsToShow = ctrl.contacts.addresses;
            }
        };

        ctrl.addEmails = function (emails) {
            ctrl.selectedAddresses = ArrayHelper.uniqueArray(ctrl.selectedAddresses.concat(emails), 'email');
            ctrl.contacts.addresses = ArrayHelper.uniqueArray(ctrl.contacts.addresses.concat(emails), 'email');
            ctrl.isSelectedAll = ctrl.contacts.addresses.length === ctrl.selectedAddresses.length;
            ctrl.showAddEmails = false;
            ctrl.showOnlySelected = false;
            ctrl.contactsToShow = ctrl.contacts.addresses;
        };

        ctrl.closeAddCustomEmails = function () {
            ctrl.showAddEmails = false;
        };

        ctrl.cancel = function () {
            ElyModal.cancel();
        };

        ctrl.openSendInvitation = function () {
            ctrl.selectedEmails = InviteFriendsSelectedEMails.getEmails(ctrl.selectedAddresses);
            ctrl.showSendEmailAddresses = true;
        };

        ctrl.closeSendInvitation = function () {
            ctrl.showSendEmailAddresses = false;
        };
    }];
