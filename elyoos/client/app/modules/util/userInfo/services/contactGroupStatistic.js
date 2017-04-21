'use strict';

var getGroup = function (statistics, group) {
    var result = null;
    angular.forEach(statistics, function (statisticElement) {
        if (group === statisticElement.group) {
            result = statisticElement;
        }
    });
    return result;
};

var addCountToNewGroup = function (elements, oldStatisticCount, newStatisticGroup) {
    if (oldStatisticCount > 0 && newStatisticGroup) {
        angular.forEach(elements, function (statisticElement) {
            if (newStatisticGroup === statisticElement.group) {
                statisticElement.count = statisticElement.count + oldStatisticCount;
            }
        });
    }
};

module.exports = ['Observables', function (Observables) {
    var statistic, service = this, observables = [];

    service.setStatistic = function (newStatistic) {
        statistic = angular.copy(newStatistic);
        Observables.notifyObservables(observables, "groupStatisticChanged");
    };

    service.getStatistic = function () {
        return angular.copy(statistic);
    };

    service.getStatisticWithContacts = function () {
        var result = [];
        if (angular.isArray(statistic)) {
            statistic.forEach(function (group) {
                if (group.count > 0) {
                    result.push(angular.copy(group));
                }
            });
        }
        return result;
    };

    service.register = function (name, observable) {
        Observables.register(observables, name, observable);
    };

    service.deregister = function (name) {
        Observables.remove(observables, name);
    };

    service.getGroups = function (excludedGroup) {
        var groups = [];
        angular.forEach(statistic, function (statisticElement) {
            if (excludedGroup !== statisticElement.group) {
                groups.push(statisticElement.group);
            }
        });
        return groups;
    };

    service.getNumberOfContacts = function () {
        var numberOfContacts = 0;
        angular.forEach(statistic, function (statisticElement) {
            numberOfContacts += statisticElement.count;
        });
        return numberOfContacts;
    };

    service.renameGroup = function (group, newGroup) {
        getGroup(statistic, group).group = newGroup;
        Observables.notifyObservables(observables, "groupStatisticChanged");
    };

    service.removeGroup = function (group, newGroup) {
        var groupToRemove = getGroup(statistic, group);
        addCountToNewGroup(statistic, groupToRemove.count, newGroup);
        if (groupToRemove) {
            statistic.splice(statistic.indexOf(groupToRemove), 1);
            Observables.notifyObservables(observables, "groupStatisticChanged");
        }
    };

    service.addGroup = function (groupName) {
        statistic.push({group: groupName, count: 0});
        Observables.notifyObservables(observables, "groupStatisticChanged");
    };

    service.removeContact = function (statisticObject) {
        var group = getGroup(statistic, statisticObject.group);
        if (group.count > 0) {
            group.count = group.count - 1;
            Observables.notifyObservables(observables, "groupStatisticChanged");
        }
    };

    service.removeContactFromGroup = function (groupName) {
        var group = getGroup(statistic, groupName);
        if (group && group.count > 0) {
            group.count = group.count - 1;
            Observables.notifyObservables(observables, "groupStatisticChanged");
        }
    };

    service.addContactToGroup = function (groupName) {
        var group = getGroup(statistic, groupName);
        group.count = group.count + 1;
        Observables.notifyObservables(observables, "groupStatisticChanged");
    };

    service.moveContact = function (previousStatistic, newGroupName) {
        var destinationGroup = getGroup(statistic, newGroupName);
        destinationGroup.count = destinationGroup.count + 1;
        service.removeContact(previousStatistic);
    };
}];
