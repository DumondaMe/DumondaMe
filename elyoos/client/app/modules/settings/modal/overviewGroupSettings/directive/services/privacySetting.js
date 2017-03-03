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
        } else if(selectedGroups.length === 0) {
            return previousSelectedGroups;
        }
        return selectedGroups;
    };

    this.getSelectedGroups = function (settings, property) {
        var selectedGroups = [];
        if (angular.isArray(settings.normal) && angular.isObject(settings.noContact)) {
            if (settings.noContact[property]) {
                selectedGroups.push("Alle");
            } else {
                settings.normal.forEach(function (group) {
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
