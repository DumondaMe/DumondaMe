'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserDetail', '$stateParams', '$mdMedia', 'ContactStatisticTypes',
            function (UserDetail, $stateParams, $mdMedia, ContactStatisticTypes) {
                var ctrl = this;

                ctrl.$mdMedia = $mdMedia;

                ctrl.userDetail = UserDetail.get({userId: $stateParams.userId}, function () {
                    ContactStatisticTypes.setStatistic(ctrl.userDetail.contactTypeStatistic);
                    ctrl.numberOfGroups = ctrl.userDetail.contactTypeStatistic.length;
                    ctrl.userName = ctrl.userDetail.user.name;
                });
            }];
    }
};

