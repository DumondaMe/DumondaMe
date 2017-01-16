'use strict';

module.exports = ['UserDetailNavigation', '$mdMedia',
    function (UserDetailNavigation, $mdMedia) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;

        ctrl.goToUserDetail = function (userId) {
            UserDetailNavigation.openUserDetail(userId);
        };

    }];

