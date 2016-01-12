'use strict';


module.exports = ['userInfo',
    function (userInfo) {

        var isPublic = true;
        var privacyTypesSelected = [];

        this.reset = function () {
            isPublic = true;
            privacyTypesSelected = [];
            angular.forEach(userInfo.getUserInfo().privacyTypes, function (privacyType) {
                privacyTypesSelected.push({type: privacyType, selected: false});
            });
        };

        this.setIsPublic = function (newIsPublic) {
            isPublic = newIsPublic;
        };

        this.isPublic = function () {
            return isPublic;
        };

        this.setPrivacyTypesSelected = function (newPrivacyType) {
            angular.forEach(privacyTypesSelected, function (privacyType) {
                if (privacyType.type === newPrivacyType.type) {
                    privacyType.selected = newPrivacyType.selected;
                }
            });
        };

        this.getPrivacyTypesSelected = function () {
            return privacyTypesSelected;
        };

        this.getVisibilityDescription = function () {
            var visibility = "";
            angular.forEach(privacyTypesSelected, function (privacyType) {
                if (privacyType.selected) {
                    visibility = visibility.concat(privacyType.type + ", ");
                }
            });
            return visibility.substring(0, visibility.length - 2);
        };

        this.isValidVisibility = function () {
            var isValid = false;
            if (isPublic) {
                isValid = true;
            }
            angular.forEach(privacyTypesSelected, function (privacyType) {
                if (privacyType.selected) {
                    isValid = true;
                }
            });
            return isValid;
        };
    }];
