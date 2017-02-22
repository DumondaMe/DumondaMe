'use strict';

module.exports = ['CheckEmailAddresses', 'EmailAddressParser', function (CheckEmailAddresses, EmailAddressParser) {
    var ctrl = this;
    ctrl.emailAddressIsValid = false;
    ctrl.selectedAddresses = [];

    ctrl.emailChanged = function () {
        ctrl.emailAddressIsValid = CheckEmailAddresses.checkAddresses(ctrl.newEmailAddresses);
        ctrl.addEmailAddressForm.emailAddresses.$setValidity('ely-custom-message', ctrl.emailAddressIsValid);
        if(ctrl.emailAddressIsValid) {
            ctrl.overviewValidEmails = EmailAddressParser.parse(ctrl.newEmailAddresses);
        }
    };

    ctrl.addEmailAddresses = function () {
        ctrl.addedEmails(EmailAddressParser.parse(ctrl.newEmailAddresses));
    };
}];
