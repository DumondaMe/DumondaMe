'use strict';

module.exports = ['CheckEmailAddresses', 'EmailAddressParser', 'StepperDialogCommandHandler',
    function (CheckEmailAddresses, EmailAddressParser, StepperDialogCommandHandler) {
        var ctrl = this;
        ctrl.selectedAddresses = [];

        ctrl.emailChanged = function () {
            StepperDialogCommandHandler.disableButtonCommand();
            ctrl.emailAddressIsValid = CheckEmailAddresses.checkAddresses(ctrl.newEmailAddresses);
            ctrl.addEmailAddressForm.emailAddresses.$setValidity('ely-custom-message', ctrl.emailAddressIsValid);
            if (ctrl.emailAddressIsValid) {
                ctrl.overviewValidEmails = EmailAddressParser.parse(ctrl.newEmailAddresses);
                StepperDialogCommandHandler.enableButtonCommand();
            }
        };

        ctrl.addEmailAddresses = function () {
            ctrl.addedEmails(EmailAddressParser.parse(ctrl.newEmailAddresses));
        };

        ctrl.replaceEmailAddress = function (email) {
            ctrl.newEmailAddresses = ctrl.newEmailAddresses.replace(email.email, email.suggestion);
            email.email = email.suggestion;
            delete email.suggestion;
        };

        StepperDialogCommandHandler.showButtonCommand(ctrl.cancel, ctrl.addEmailAddresses, 'Hinzufügen');
    }];