'use strict';

var charCodeEnter = 13;

module.exports = ['AddressSuggestion', function (AddressSuggestion) {
    var ctrl = this;

    if (ctrl.isEditMode) {
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

    ctrl.searchAddress = function () {
        if (angular.isString(ctrl.addressSearch) && ctrl.addressSearch.trim() !== "") {
            ctrl.requestStarted = true;
            ctrl.addresses = AddressSuggestion.query({address: ctrl.addressSearch}, function () {
                ctrl.requestStarted = false;
                if (ctrl.addresses.length > 0) {
                    ctrl.lastRequestString = ctrl.addressSearch;
                    if (!ctrl.isEditMode) {
                        ctrl.selectedAddress = ctrl.addresses[0];
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

