'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserDetail', '$stateParams', '$mdMedia', 'ContactStatisticTypes', 'ContactStatistic',
            function (UserDetail, $stateParams, $mdMedia, ContactStatisticTypes, ContactStatistic) {
                var ctrl = this;

                ctrl.$mdMedia = $mdMedia;

                ctrl.statistics = ContactStatistic.get(function () {
                    ContactStatisticTypes.setStatistic(ctrl.statistics.statistic);
                });

                ctrl.userDetail = UserDetail.get({userId: $stateParams.userId}, function () {
                    ContactStatisticTypes.setStatistic(ctrl.userDetail.contactTypeStatistic);
                });
            }];
    }
};

