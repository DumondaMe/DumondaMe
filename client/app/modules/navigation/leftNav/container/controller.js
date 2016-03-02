'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Auth', '$state', '$mdSidenav', 'userInfo',
            function (Auth, $state, $mdSidenav, userInfo) {
                var ctrl = this;

                ctrl.userInfo = userInfo.getUserInfo();
                userInfo.register('leftNav', ctrl);

                ctrl.userInfoChanged = function () {
                    ctrl.userInfo = userInfo.getUserInfo();
                };

                ctrl.logout = function () {
                    Auth.logout().then(function () {
                        $mdSidenav("left").close();
                        delete ctrl.userInfo;
                        $state.go('login');
                    });
                };

                ctrl.goToProfile = function () {
                    $mdSidenav("left").close();
                    $state.go('settings.profile');
                };
            }];
    }
};
