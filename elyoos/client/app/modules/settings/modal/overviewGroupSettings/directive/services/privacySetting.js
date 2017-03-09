'use strict';

module.exports = [function () {
    this.getGroupNames = function (settings, profileVisible) {
        var groupNames = [];
        if (profileVisible) {
            groupNames.push("Alle");
        }
        settings.forEach(function (setting) {
            groupNames.push(setting.type);
        });
        return groupNames;
    };

    this.handlingGroupSelection = function (selectedGroups, previousSelectedGroups) {
        selectedGroups = angular.copy(selectedGroups);
        if (selectedGroups.indexOf("Alle") !== -1 && previousSelectedGroups.indexOf("Alle") === -1) {
            return ["Alle"];
        } else if (previousSelectedGroups.indexOf("Alle") !== -1 &&
            selectedGroups.indexOf("Alle") !== -1 && selectedGroups.length > 1) {
            return selectedGroups.splice(selectedGroups.indexOf("Alle") - 1, 1);
        } else if (selectedGroups.length === 0) {
            return previousSelectedGroups;
        }
        return selectedGroups;
    };

    this.handlingProfileVisibleSelection = function (selectedGroups, previousSelectedGroups) {
        if (angular.isArray(selectedGroups) && selectedGroups.length > 0) {
            if (selectedGroups.indexOf("Alle") !== -1 && previousSelectedGroups.indexOf("Alle") === -1) {
                return ["Alle"];
            } else {
                return ['Nur Kontakte'];
            }
        }
        return [];
    };

    this.setPrivacySettingProfileVisible = function (settings, selectedProfileSetting) {
        settings = angular.copy(settings);
        if (angular.isObject(settings.noContact)) {
            if (selectedProfileSetting.indexOf("Alle") !== -1) {
                settings.noContact.profileVisible = true;
            } else {
                settings.noContact.profileVisible = false;
                settings.noContact.contactsVisible = false;
                settings.noContact.imageVisible = false;
                settings.noContact.pinwallVisible = false;
            }
        }
        return settings;
    };

    this.setPrivacySetting = function (settings, selected, property) {
        settings = angular.copy(settings);
        if (selected.indexOf("Alle") !== -1) {
            settings.noContact[property] = true;
            settings.group.forEach(function (group) {
                group[property] = true;
            });
        } else {
            settings.noContact[property] = false;
            settings.group.forEach(function (group) {
                group[property] = selected.indexOf(group.type) !== -1;
            });
        }
        return settings;
    };

    this.getSelectedGroups = function (settings, property) {
        var selectedGroups = [];
        if (angular.isArray(settings.group) && angular.isObject(settings.noContact)) {
            if (settings.noContact[property]) {
                selectedGroups.push("Alle");
            } else {
                settings.group.forEach(function (group) {
                    if (group[property]) {
                        selectedGroups.push(group.type);
                    }
                });
            }
        }
        return selectedGroups;
    };

    this.getSelectedProfileVisible = function (settings) {
        var selectedGroups = [];
        if (angular.isObject(settings.noContact)) {
            if (settings.noContact.profileVisible) {
                selectedGroups.push("Alle");
            } else {
                selectedGroups.push("Nur Kontakte");
            }
        }
        return selectedGroups;
    };
}]
;
