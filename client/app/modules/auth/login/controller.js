'use strict';

module.exports = ['$scope', '$state', 'Auth', 'UrlCache', function ($scope, $state, Auth, UrlCache) {
    var ctrl = this;

    ctrl.loginRunning = false;

    ctrl.login = function () {
        delete ctrl.error;
        ctrl.loginRunning = true;
        Auth.login({
            username: ctrl.loginuser.email,
            password: ctrl.loginuser.password
        }).then(function () {
            ctrl.loginRunning = false;
            UrlCache.reset();
            $scope.$broadcast('elyoos.login');
            $state.go('home');
        }, function () {
            ctrl.loginRunning = false;
            ctrl.error = "Benuztername existiert nicht oder das Passwort ist falsch!";
        });
    };
}];