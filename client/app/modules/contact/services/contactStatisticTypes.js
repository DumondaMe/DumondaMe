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
    }];
