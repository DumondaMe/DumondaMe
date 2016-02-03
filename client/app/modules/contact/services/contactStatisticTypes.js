'use strict';

var getStatisticToRemove = function (elements, type) {
    var statisticToRemove = null;
    angular.forEach(elements, function (statisticElement) {
        if (type === statisticElement.type) {
            statisticToRemove = statisticElement;
        }
    });
    return statisticToRemove;
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

        var statistic;

        this.setStatistic = function (newStatistic) {
            statistic = newStatistic;
        };

        this.getTypes = function (excludedGroup) {
            var types = [];
            angular.forEach(statistic, function (statisticElement) {
                if (excludedGroup !== statisticElement.type) {
                    types.push(statisticElement.type);
                }
            });
            return types;
        };

        this.removeType = function (type, newType) {
            var elementToRemove = getStatisticToRemove(statistic, type);
            addCountToNewStatistic(statistic, elementToRemove.count, newType);
            if (elementToRemove) {
                statistic.splice(statistic.indexOf(elementToRemove), 1);
            }
        };
    }];
