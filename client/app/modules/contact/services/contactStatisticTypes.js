'use strict';

var getStatistic = function (statistics, type) {
    var result = null;
    angular.forEach(statistics, function (statisticElement) {
        if (type === statisticElement.type) {
            result = statisticElement;
        }
    });
    return result;
};

var addCountToNewStatistic = function (elements, oldStatisticCount, newStatisticType) {
    if (oldStatisticCount > 0 && newStatisticType) {
        angular.forEach(elements, function (statisticElement) {
            if (newStatisticType === statisticElement.type) {
                statisticElement.count = statisticElement.count + oldStatisticCount;
            }
        });
    }
};

module.exports = [
    function () {

        var statistic, service = this;

        service.setStatistic = function (newStatistic) {
            statistic = newStatistic;
        };

        service.getTypes = function (excludedGroup) {
            var types = [];
            angular.forEach(statistic, function (statisticElement) {
                if (excludedGroup !== statisticElement.type) {
                    types.push(statisticElement.type);
                }
            });
            return types;
        };

        service.getNumberOfContacts = function () {
            var numberOfContacts = 0;
            angular.forEach(statistic, function (statisticElement) {
                numberOfContacts += statisticElement.count;
            });
            return numberOfContacts;
        };

        service.renameType = function (type, newType) {
            getStatistic(statistic, type).type = newType;
        };

        service.removeType = function (type, newType) {
            var elementToRemove = getStatistic(statistic, type);
            addCountToNewStatistic(statistic, elementToRemove.count, newType);
            if (elementToRemove) {
                statistic.splice(statistic.indexOf(elementToRemove), 1);
            }
        };

        service.removeContact = function (statisticObject) {
            if (statisticObject.count > 0) {
                statisticObject.count = statisticObject.count - 1;
            }
        };

        service.removeContactByName = function (statisticName) {
            var statisticObject = getStatistic(statistic, statisticName);
            if (statisticObject && statisticObject.count > 0) {
                statisticObject.count = statisticObject.count - 1;
            }
        };

        service.addContactByName = function (statisticName) {
            var statisticObject = getStatistic(statistic, statisticName);
            statisticObject.count = statisticObject.count + 1;
        };

        service.moveContact = function (previousStatistic, newGroupName) {
            var newStatistic = getStatistic(statistic, newGroupName);
            service.removeContact(previousStatistic);
            newStatistic.count = newStatistic.count + 1;
            if (newStatistic.hasOwnProperty('reloadContact')) {
                newStatistic.reloadContact();
            }
        };
    }];
