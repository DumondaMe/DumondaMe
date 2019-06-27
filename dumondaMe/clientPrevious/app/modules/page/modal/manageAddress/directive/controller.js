'use strict';

var charCodeEnter = 13;

var resetValidation = function (ctrl) {
    ctrl.isAllowedToSend = true;
    if (ctrl.addAddressForm.hasOwnProperty('actualAddress')) {
        ctrl.addAddressForm.actualAddress.$setValidity('ely-required', true);
        ctrl.addAddressForm.actualAddress.$setValidity('ely-max-length', true);
    }
    if (ctrl.addAddressForm.hasOwnProperty('description')) {
        ctrl.addAddressForm.actualAddress.$setValidity('ely-max-length', true);
    }
    if (angular.isArray(ctrl.addresses)) {
        ctrl.addresses.forEach(function (address, index) {
            if (ctrl.addAddressForm.hasOwnProperty(index + 'address')) {
                ctrl.addAddressForm[index + 'address'].$setValidity('ely-required', true);
                ctrl.addAddressForm[index + 'address'].$setValidity('ely-max-length', true);
            }
        });
    }
};

module.exports = ['AddressSuggestion', function (AddressSuggestion) {
    var ctrl = this;
    ctrl.isAllowedDescriptionToSend = true;

    if (ctrl.isEditMode) {
        ctrl.isAllowedToSend = true;
        ctrl.selectedAddress = ctrl.actualAddress;
        ctrl.actualAddressCompare = angular.copy(ctrl.actualAddress);
        ctrl.description = angular.copy(ctrl.actualDescription);
    }

    ctrl.addressSearchChanged = function () {
        ctrl.addressSearchIsValid = false;
        if (angular.isString(ctrl.addressSearch) && ctrl.addressSearch.trim().length >= 3 && ctrl.addressSearch.trim().length <= 150) {
            ctrl.addressSearchIsValid = true;
        }
    };

    ctrl.selectedDescriptionChanged = function () {
        ctrl.isAllowedDescriptionToSend = true;
        if (angular.isString(ctrl.description) && ctrl.description.length > 500) {
            ctrl.addAddressForm.description.$setValidity('ely-max-length', false);
            ctrl.isAllowedDescriptionToSend = false;
        }
        if (angular.isString(ctrl.description) && ctrl.description.trim() === "") {
            delete ctrl.description;
        }
    };

    ctrl.selectAddressChanged = function (newSelectedAddress, addressName) {
        ctrl.selectedAddress = newSelectedAddress;
        ctrl.selectAddressValueChanged(newSelectedAddress, addressName);
    };

    ctrl.selectAddressValueChanged = function (addressValue, addressName) {
        resetValidation(ctrl);
        if ((!angular.isString(addressValue.address) || angular.isString(addressValue.address) && addressValue.address.trim() === "")) {
            ctrl.addAddressForm[addressName].$setValidity('ely-required', false);
            ctrl.isAllowedToSend = false;
        } else if (angular.isString(addressValue.address) && addressValue.address.length > 500) {
            ctrl.addAddressForm[addressName].$setValidity('ely-max-length', false);
            ctrl.isAllowedToSend = false;
        }
    };

    ctrl.searchAddress = function () {
        if (angular.isString(ctrl.addressSearch) && ctrl.addressSearch.trim() !== "") {
            ctrl.requestStarted = true;
            ctrl.addresses = AddressSuggestion.query({address: ctrl.addressSearch}, function () {
                ctrl.requestStarted = false;
                if (ctrl.addresses.length > 0) {
                    ctrl.lastRequestString = ctrl.addressSearch;
                    if (!ctrl.isEditMode) {
                        ctrl.selectedAddress = ctrl.addresses[0];
                        ctrl.isAllowedToSend = true;
                    }
                }
            }, function () {
                ctrl.requestStarted = false;
            });
        }
    };

    ctrl.keyPressed = function ($event) {
        if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
            ctrl.searchAddress();
        }
    };

    ctrl.addAddress = function () {
        ctrl.onSelected(ctrl.selectedAddress, ctrl.description);
        delete ctrl.selectedAddress;
        delete ctrl.lastRequestString;
        delete ctrl.addressSearch;
        ctrl.addresses = [];
    };
}];

