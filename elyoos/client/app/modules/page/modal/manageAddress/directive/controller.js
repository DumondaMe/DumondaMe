'use strict';

var charCodeEnter = 13;

module.exports = ['AddressSuggestion', function (AddressSuggestion) {
    var ctrl = this;

    if (ctrl.isEditMode) {
        ctrl.selectedAddress = ctrl.actualAddress;
        ctrl.description = angular.copy(ctrl.actualDescription);
    }

    ctrl.searchAddress = function () {
        ctrl.requestStarted = true;
        ctrl.addresses = AddressSuggestion.query({address: ctrl.data.address}, function () {
            ctrl.requestStarted = false;
            if (ctrl.addresses.length > 0) {
                ctrl.lastRequestString = ctrl.data.address;
                if (!ctrl.isEditMode) {
                    ctrl.selectedAddress = ctrl.addresses[0];
                }
            }
        }, function () {
            ctrl.requestStarted = false;
        });
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
        if (ctrl.data) {
            delete ctrl.data.address;
        }
        ctrl.addresses = [];
    };
}];

