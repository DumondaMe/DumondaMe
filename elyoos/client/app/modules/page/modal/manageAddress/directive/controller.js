'use strict';

var charCodeEnter = 13;

module.exports = ['AddressSuggestion', '$mdMedia',
    function (AddressSuggestion, $mdMedia) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;
        ctrl.selectedAddress = null;

        ctrl.searchAddress = function () {
            ctrl.requestStarted = true;
            ctrl.addresses = AddressSuggestion.query({address: ctrl.data.address}, function () {
                ctrl.requestStarted = false;
                if (ctrl.addresses.length > 0) {
                    ctrl.lastRequestString = ctrl.data.address;
                    ctrl.selectedAddress = ctrl.addresses[0];
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
            delete ctrl.data.address;
            ctrl.addresses = [];
        };

    }];

