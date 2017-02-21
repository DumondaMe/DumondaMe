'use strict';

module.exports = ['CheckEmailAddresses', function (CheckEmailAddresses) {
    var ctrl = this;
    ctrl.emailAddressIsValid = false;

    ctrl.emailChanged = function () {
        ctrl.emailAddressIsValid = CheckEmailAddresses.checkAddresses(ctrl.newEmailAddresses);
        ctrl.addEmailAddressForm.emailAddresses.$setValidity('ely-custom-message', ctrl.emailAddressIsValid);
    };
}];
