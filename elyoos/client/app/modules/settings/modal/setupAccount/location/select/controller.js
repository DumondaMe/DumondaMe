'use strict';

var charCodeEnter = 13;

module.exports = ['AddressSuggestion', 'UserLocation', 'userInfo', function (AddressSuggestion, UserLocation, userInfo) {
    var ctrl = this, previousSelectedAddress = null, userInfoData = userInfo.getUserInfo();

    ctrl.selectedAddress = null;

    if (angular.isString(userInfoData.userLocationDescription) && angular.isNumber(userInfoData.latitude) &&
        angular.isNumber(userInfoData.longitude)) {
        ctrl.addressSearch = userInfoData.userLocationDescription;
    }

    ctrl.addressSearchChanged = function () {
        ctrl.addressSearchIsValid = false;
        ctrl.disableNavigation(false);
        ctrl.noMessagesFound = false;
        if (angular.isString(ctrl.addressSearch) && ctrl.addressSearch.trim().length >= 3 &&
            ctrl.addressSearch !== userInfoData.userLocationDescription) {
            ctrl.addressSearchIsValid = true;
            ctrl.disableNavigation(true);
        } else if (userInfoData.userLocationDescription && (!ctrl.addressSearch || ctrl.addressSearch.trim() === "")) {
            ctrl.addressChanged(null);
        }
    };

    ctrl.autocompleteAddress = function (search) {
        if (angular.isString(search) && search.trim() !== "" && search.length >= 3 &&
            userInfoData.userLocationDescription !== search) {
            ctrl.setRequestStarted(true);
            return AddressSuggestion.query({address: search}).$promise.then(function (resp) {
                return resp;
            }).finally(function () {
                ctrl.setRequestStarted(false);
            });
        } else if (angular.isString(search) && search.trim() !== "" && search.length >= 3 &&
            angular.isString(userInfoData.userLocationDescription) && userInfoData.userLocationDescription === search) {
            previousSelectedAddress = {
                address: userInfoData.userLocationDescription,
                latitude: userInfoData.latitude,
                longitude: userInfoData.longitude,
            };
            return [previousSelectedAddress];
        } else {
            return [];
        }
    };

    ctrl.searchAddress = function () {
        if (angular.isString(ctrl.addressSearch) && ctrl.addressSearch.trim() !== "") {
            ctrl.setRequestStarted(true);
            ctrl.addresses = AddressSuggestion.query({address: ctrl.addressSearch}, function () {
                if (ctrl.addresses.length === 0) {
                    ctrl.noMessagesFound = true;
                }
                ctrl.addressSearchIsValid = false;
                ctrl.setRequestStarted(false);
            }, function () {
                ctrl.setRequestStarted(false);
            });
        }
    };

    ctrl.keyPressed = function ($event) {
        if ($event.charCode === charCodeEnter || $event.keyCode === charCodeEnter) {
            ctrl.searchAddress();
        }
    };

    ctrl.addressChanged = function (selectedAddress) {
        if (selectedAddress && angular.isString(selectedAddress.address) &&
            previousSelectedAddress !== selectedAddress) {
            previousSelectedAddress = selectedAddress;
            ctrl.setRequestStarted(true);
            UserLocation.save({
                description: selectedAddress.address,
                latitude: selectedAddress.latitude,
                longitude: selectedAddress.longitude
            }, function () {
                ctrl.userLocationChanged({
                    address: selectedAddress.address,
                    latitude: selectedAddress.latitude,
                    longitude: selectedAddress.longitude
                });
                ctrl.setRequestStarted(false);
                ctrl.disableNavigation(false);
                ctrl.addressSearchIsValid = false;
                ctrl.addressSearch = userInfoData.userLocationDescription;
            }, function () {
                ctrl.setRequestStarted(false);
                ctrl.disableNavigation(false);
                ctrl.addressSearchIsValid = false;
            });
        } else if (selectedAddress === null) {
            ctrl.setRequestStarted(true);
            UserLocation.delete({}, function () {
                ctrl.setRequestStarted(false);
                ctrl.addressSearchIsValid = false;
                ctrl.selectedAddress = null;
                ctrl.userLocationChanged(null);
            }, function () {
                ctrl.setRequestStarted(false);
                ctrl.addressSearchIsValid = false;
            });
        }
    };

    ctrl.setRequestStarted = function (newRequestStarted) {
        ctrl.requestStartedValue = newRequestStarted;
        ctrl.requestStarted(newRequestStarted);
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

