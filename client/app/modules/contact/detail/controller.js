'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['UserDetail', '$stateParams', '$mdMedia', 'ContactStatisticTypes', 'UserDetailContacts', 'UserDetailContactings',
            function (UserDetail, $stateParams, $mdMedia, ContactStatisticTypes, UserDetailContacts, UserDetailContactings) {
                var ctrl = this;

                ctrl.$mdMedia = $mdMedia;
                ctrl.UserDetailContacts = UserDetailContacts;
                ctrl.UserDetailContactings = UserDetailContactings;

                ctrl.userDetail = UserDetail.get({userId: $stateParams.userId}, function () {
                    ContactStatisticTypes.setStatistic(ctrl.userDetail.contactTypeStatistic);
                    ctrl.numberOfGroups = ctrl.userDetail.contactTypeStatistic.length;
                    ctrl.userName = ctrl.userDetail.user.forename;
                });

                ctrl.showContactOverview = function () {
                    ctrl.showOverviewContact = true;
                };

                ctrl.showContactingOverview = function () {
                    ctrl.showOverviewContacting = true;
                };
                
                ctrl.close = function () {
                    ctrl.showOverviewContact = false;
                    ctrl.showOverviewContacting = false;
                };
            }];
    }
};

