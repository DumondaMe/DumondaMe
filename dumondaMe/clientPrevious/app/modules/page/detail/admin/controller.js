'use strict';

module.exports = ['UserDetailNavigation', '$mdMedia', '$stateParams', 'SyncTc',
    function (UserDetailNavigation, $mdMedia, $stateParams, SyncTc) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;
        ctrl.label = $stateParams.label;

        ctrl.goToUserDetail = function (userId) {
            UserDetailNavigation.openUserDetail(userId);
        };

        ctrl.tcSyncState = function (state) {
            SyncTc.update({pageId: ctrl.pageDetail.page.pageId, state: state}, function () {
                ctrl.pageDetail.page.exportToTc = state;
            });
        };
    }];

