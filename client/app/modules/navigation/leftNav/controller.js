'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Auth', '$state', '$mdSidenav', 'userInfo', '$mdMedia', function (Auth, $state, $mdSidenav, userInfo, $mdMedia) {
            var ctrl = this;

            ctrl.$mdMedia = $mdMedia;

            ctrl.userInfo = userInfo.getUserInfo();
            userInfo.register(ctrl);

            ctrl.userInfoChanged = function () {
                ctrl.userInfo = userInfo.getUserInfo();
            };

            ctrl.logout = function () {
                Auth.logout().then(function () {
                    $mdSidenav("left").close();
                    $state.go('login');
                });
            };

        }];
    }
};
