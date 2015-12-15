'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['Auth', '$state', '$mdSidenav', function (Auth, $state, $mdSidenav) {
            var ctrl = this;

            ctrl.logout = function () {
                Auth.logout().then(function () {
                    $mdSidenav("left").close();
                    $state.go('login');
                });
            };

        }];
    }
};
