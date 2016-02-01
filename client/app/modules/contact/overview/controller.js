'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['ContactStatistic', 'ContactStatisticTypes',
            function (ContactStatistic, ContactStatisticTypes) {
                var ctrl = this;

                ctrl.statistics = ContactStatistic.get(function () {
                    ContactStatisticTypes.setStatistic(ctrl.statistics.statistic);
                });
            }];
    }
};

