'use strict';

var charCodeEnter = 13;

module.exports = ['AddressSuggestion', 'UserLocation', 'userInfo', function (AddressSuggestion, UserLocation, userInfo) {
    var ctrl = this, previousSelectedAddress = null, userInfoData = userInfo.getUserInfo();

    ctrl.selectedAddress = null;

    if (angular.isString(userInfoData.userLocationDescription) && angular.isNumber(userInfoData.latitude) &&
        angular.isNumber(userInfoData.longitude)) {
        ctrl.userLocation = {
            address: userInfoData.userLocationDescription,
            latitude: userInfoData.latitude,
            longitude: userInfoData.longitude
        };
        ctrl.selectedAddress = ctrl.userLocation;
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

    ctrl.addressChanged = function () {
        if (ctrl.selectedAddress && angular.isString(ctrl.selectedAddress.address) &&
            previousSelectedAddress !== ctrl.selectedAddress) {
            previousSelectedAddress = ctrl.selectedAddress;
            ctrl.requestStarted = true;
            UserLocation.save({
                description: ctrl.selectedAddress.address,
                latitude: ctrl.selectedAddress.latitude,
                longitude: ctrl.selectedAddress.longitude
            }, function () {
                ctrl.userLocationChanged({
                    address: ctrl.selectedAddress.address,
                    latitude: ctrl.selectedAddress.latitude,
                    longitude: ctrl.selectedAddress.longitude
                });
                ctrl.requestStarted = false;
            }, function () {
                ctrl.requestStarted = false;
            });
        } else if (ctrl.selectedAddress === null) {
            ctrl.requestStarted = true;
            UserLocation.delete({}, function () {
                ctrl.requestStarted = false;
                ctrl.userLocationChanged(null);
            }, function () {
                ctrl.requestStarted = false;
            });
        }
    };

    ctrl.userLocationChanged = function (newUserLocation) {
        if (newUserLocation) {
            userInfoData.userLocationDescription = newUserLocation.address;
            userInfoData.latitude = newUserLocation.latitude;
            userInfoData.longitude = newUserLocation.longitude;
        } else {
            delete userInfoData.userLocationDescription;
            delete userInfoData.latitude;
            delete userInfoData.longitude;
        }
    };
}];

