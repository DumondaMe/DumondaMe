'use strict';

module.exports = ['UserDetailNavigation',
    function (UserDetailNavigation) {
        var ctrl = this;


        ctrl.goToUserDetail = function (userId) {
            UserDetailNavigation.openUserDetail(userId);
        };

    }];

