'use strict';

module.exports = [
    function () {

        var statistic;

        this.setStatistic = function (newStatistic) {
            statistic = newStatistic;
        };

        this.getTypes = function () {
            var types = [];
            angular.forEach(statistic, function (statisticElement) {
                types.push(statisticElement.type);
            });
            return types;
        };

        this.removeType = function (type) {
            var elementToRemove;
            angular.forEach(statistic, function (statisticElement) {
                if (type === statisticElement.type) {
                    elementToRemove = statisticElement;
                }
            });
            if (elementToRemove) {
                statistic.splice(statistic.indexOf(elementToRemove), 1);
            }
        };
    }];
