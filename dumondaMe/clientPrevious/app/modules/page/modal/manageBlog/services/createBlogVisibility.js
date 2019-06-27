'use strict';


module.exports = ['ContactGroupStatistic',
    function (ContactGroupStatistic) {

        var isPublic = true;
        var privacyTypes = [];

        this.reset = function () {
            isPublic = true;
            privacyTypes = [];
            angular.forEach(ContactGroupStatistic.getStatistic(), function (privacyType) {
                privacyTypes.push({type: privacyType.group, selected: false});
            });
        };

        this.setIsPublic = function (newIsPublic) {
            isPublic = newIsPublic;
        };

        this.isPublic = function () {
            return isPublic;
        };

        this.setPrivacyTypesSelected = function (newPrivacyType) {
            angular.forEach(privacyTypes, function (privacyType) {
                if (privacyType.type === newPrivacyType.type) {
                    privacyType.selected = newPrivacyType.selected;
                }
            });
        };

        this.getPrivacyTypes = function () {
            return privacyTypes;
        };

        this.getPrivacyTypesSelected = function () {
            var selected = [];
            angular.forEach(privacyTypes, function (privacyType) {
                if (privacyType.selected) {
                    selected.push(privacyType.type);
                }
            });
            return selected;
        };

        this.getVisibilityDescription = function () {
            var visibility = [];
            angular.forEach(privacyTypes, function (privacyType) {
                if (privacyType.selected) {
                    visibility.push(privacyType.type);
                }
            });
            return visibility;
        };

        this.isValidVisibility = function () {
            var isValid = false;
            if (isPublic) {
                isValid = true;
            }
            angular.forEach(privacyTypes, function (privacyType) {
                if (privacyType.selected) {
                    isValid = true;
                }
            });
            return isValid;
        };
    }];
