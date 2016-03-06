'use strict';

module.exports = [
    function () {

        var lastSetting;

        this.getSetting = function (settingsNormal, settingNoContact, groupName) {
            var setting;
            angular.forEach(settingsNormal, function (group) {
                if (group.type === groupName) {
                    setting = group;
                }
            });
            if (!setting) {
                setting = settingNoContact;
            }
            lastSetting = angular.copy(setting);
            return setting;
        };

        this.setLastSetting = function(newLastSetting) {
            lastSetting = angular.copy(newLastSetting);
        };

        this.settingHasChanged = function (setting) {
            if (setting && lastSetting) {
                return !angular.equals(setting, lastSetting);
            }
            return false;
        }
    }]
;
