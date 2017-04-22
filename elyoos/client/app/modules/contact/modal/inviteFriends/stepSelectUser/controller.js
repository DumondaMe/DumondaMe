'use strict';

module.exports = ['ImportGmxContacts', 'ImportWebDeContacts', 'SendInviteEmail', 'ArrayHelper',
    'InviteFriendsSelectedEMails', 'errorToast', 'StepperDialogSteps', 'StepperDialogCommandHandler',
    function (ImportGmxContacts, ImportWebDeContacts, SendInviteEmail, ArrayHelper,
              InviteFriendsSelectedEMails, errorToast, StepperDialogSteps, StepperDialogCommandHandler) {
        var ctrl = this;
        InviteFriendsSelectedEMails.reset();
        ctrl.selectedAddresses = InviteFriendsSelectedEMails.getSelectedEmails();
        ctrl.successfullyImportedServices = [];
        ctrl.isSelectedAll = false;
        ctrl.contacts = {addresses: []};

        ctrl.step = {
            label: 'Kontakte auswählen',
            selected: false
        };
        StepperDialogSteps.addStep(ctrl.step);

        ctrl.sourceImportStarted = function () {
            ctrl.importStarted = true;
            StepperDialogCommandHandler.showProgressBar();
        };

        ctrl.sourceImportFinish = function (err, importSource) {
            ctrl.importStarted = false;
            StepperDialogCommandHandler.hideProgressBar();
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
            if (!ctrl.importStarted) {
                ctrl.basicAuthName = 'GMX';
                ctrl.basicAuthService = ImportGmxContacts;
                ctrl.showBasicAuth = true;
                ctrl.commandAbortStepperDialog = ctrl.closeBasicAuth;
                ctrl.commandStepperDialogLabel = 'Addressbuch laden';
            }
        };

        ctrl.openBasicAuthWebDe = function () {
            if (!ctrl.importStarted) {
                ctrl.basicAuthName = 'WEB.DE';
                ctrl.basicAuthService = ImportWebDeContacts;
                ctrl.showBasicAuth = true;
                ctrl.commandAbortStepperDialog = ctrl.closeBasicAuth;
                ctrl.commandStepperDialogLabel = 'Addressbuch laden';
            }
        };

        ctrl.closeBasicAuth = function (importSource) {
            ctrl.showBasicAuth = false;
            ctrl.importStarted = false;
            StepperDialogCommandHandler.hideProgressBar();
            StepperDialogCommandHandler.hideButtonCommand();
            if (angular.isString(importSource)) {
                ctrl.isSelectedAll = ctrl.contacts.addresses.length === ctrl.selectedAddresses.length;
                ctrl.successfullyImportedServices.push(importSource);
                ctrl.showOnlySelected = false;
                ctrl.contactsToShow = ctrl.contacts.addresses;
            }
        };

        ctrl.emailExists = InviteFriendsSelectedEMails.emailExists;

        ctrl.toggleEmail = function (email) {
            InviteFriendsSelectedEMails.toggleEmail(email, ctrl.contacts.addresses);
            ctrl.isSelectedAll = InviteFriendsSelectedEMails.isSelectedAll(ctrl.contacts.addresses);
            ctrl.maxSelected = InviteFriendsSelectedEMails.isMaxSelected();
            if (InviteFriendsSelectedEMails.getSelectedEmails().length === 0) {
             ctrl.showOnlySelected = false;
             ctrl.contactsToShow = ctrl.contacts.addresses;
             }
            ctrl.checkNavigationIsDisabled();
        };

        ctrl.toggleAllEmailSelections = function () {
            ctrl.selectedAddresses = InviteFriendsSelectedEMails.toggleAllEmailSelections(ctrl.contacts.addresses);
            ctrl.maxSelected = InviteFriendsSelectedEMails.isMaxSelected();
            ctrl.checkNavigationIsDisabled();
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
            StepperDialogCommandHandler.hideButtonCommand();
            ctrl.checkNavigationIsDisabled();
        };

        ctrl.openAddCustomEmails = function () {
            if (!ctrl.importStarted) {
                ctrl.showAddEmails = true;
            }
        };

        ctrl.closeAddCustomEmails = function () {
            ctrl.showAddEmails = false;
            StepperDialogCommandHandler.hideButtonCommand();
        };

        ctrl.checkNavigationIsDisabled = function () {
            StepperDialogCommandHandler.disableNavigation();
            if (angular.isArray(ctrl.selectedAddresses) && ctrl.selectedAddresses.length > 0) {
                StepperDialogCommandHandler.enableNavigation();
            }
        };
    }];
