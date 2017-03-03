'use strict';

module.exports = [function () {
    this.getGroupNames = function (settings) {
        var groupNames = [];
        groupNames.push({type: "Alle"});
        settings.forEach(function (setting) {
            groupNames.push({type: setting.type});
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

    this.setPrivacySettingProfileVisible = function (settings, selectedProfileSetting) {
        settings = angular.copy(settings);
        if (angular.isArray(settings.group) && angular.isObject(settings.noContact)) {
            if (selectedProfileSetting.indexOf("Alle") !== -1) {
                settings.noContact.profileVisible = true;
                settings.group.forEach(function (group) {
                    group.profileVisible = true;
                });
                ['contactsVisible', 'imageVisible', 'pinwallVisible'].forEach(function (property) {
                    var isVisibleForAll = true;
                    settings.group.forEach(function (group) {
                        if (!group[property]) {
                            isVisibleForAll = false;
                        }
                    });
                    settings.noContact[property] = isVisibleForAll;
                });
            } else {
                settings.noContact.profileVisible = false;
                settings.noContact.contactsVisible = false;
                settings.noContact.imageVisible = false;
                settings.noContact.pinwallVisible = false;
                settings.group.forEach(function (group) {
                    if (selectedProfileSetting.indexOf(group.type) < 0) {
                        group.profileVisible = false;
                        group.contactsVisible = false;
                        group.imageVisible = false;
                        group.pinwallVisible = false;
                    } else {
                        group.profileVisible = true;
                        group.contactsVisible = true;
                        group.imageVisible = true;
                        group.pinwallVisible = true;
                    }
                });
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

    this.setDisabled = function (settings, groupNames) {
        if (angular.isArray(settings.group) && angular.isObject(settings.noContact) && angular.isArray(groupNames)) {
            groupNames.forEach(function (groupName) {
                if (groupName.type === 'Alle') {
                    groupName.disabled = !settings.noContact.profileVisible;
                } else {
                    settings.group.forEach(function (group) {
                        if (group.type === groupName.type) {
                            groupName.disabled = !group.profileVisible;
                        }
                    });
                }
            });
        }
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
}]
;
