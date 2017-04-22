'use strict';

var maxSelectedLength = 1000;

module.exports = ['ArrayHelper', 'errorToast', function (ArrayHelper, errorToast) {

    var service = this, selectedEmails = [], maxSelected = false, toggleAllSelected = false;

    service.reset = function () {
        selectedEmails = [];
        maxSelected = false;
        toggleAllSelected = false;
    };

    service.getEmails = function () {
        var emails = [];
        selectedEmails.forEach(function (selectedEmail) {
            emails.push(selectedEmail.email);
        });
        return emails;
    };

    service.getSelectedEmails = function () {
        return selectedEmails;
    };

    service.setSelectedEmails = function (newSelectedEmails) {
        selectedEmails = newSelectedEmails;
    };

    service.emailExists = function (email) {
        return ArrayHelper.getIndex(selectedEmails, email, 'email') > -1;
    };

    service.toggleEmail = function (email, allEmails) {
        var idx = ArrayHelper.getIndex(selectedEmails, email, 'email');
        maxSelected = false;
        if (idx > -1) {
            selectedEmails.splice(idx, 1);
        }
        else {
            if (selectedEmails.length < maxSelectedLength) {
                selectedEmails.push(email);
            } else {
                maxSelected = true;
                errorToast.showWarning('Es können nicht mehr als 1000 Adressen ausgewählt werden.');
            }
        }
        toggleAllSelected = service.isSelectedAll(allEmails);
    };

    service.resetToggleAll = function () {
        toggleAllSelected = false;
    };

    service.toggleAllEmailSelections = function (allEmails) {
        selectedEmails = [];
        if (!toggleAllSelected) {
            allEmails.forEach(function (address) {
                if (selectedEmails.length < maxSelectedLength) {
                    selectedEmails.push(address);
                }
            });
            if (allEmails.length > selectedEmails.length) {
                maxSelected = true;
            } else {
                toggleAllSelected = true;
            }
        } else {
            maxSelected = false;
            toggleAllSelected = false;
        }
        return selectedEmails;
    };

    service.isMaxSelected = function () {
        return maxSelected;
    };

    service.isSelectedAll = function (allEmails) {
        return selectedEmails.length === allEmails.length ||
            selectedEmails.length === maxSelectedLength;
    };
}];
