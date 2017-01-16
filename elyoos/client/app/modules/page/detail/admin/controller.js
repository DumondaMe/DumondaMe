'use strict';

module.exports = ['UserDetailNavigation', '$mdMedia', '$stateParams',
    function (UserDetailNavigation, $mdMedia, $stateParams) {
        var ctrl = this;

        ctrl.$mdMedia = $mdMedia;
        ctrl.label = $stateParams.label;

        ctrl.goToUserDetail = function (userId) {
            UserDetailNavigation.openUserDetail(userId);
        };

    }];

