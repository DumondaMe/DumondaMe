'use strict';

module.exports = ['$scope', '$state', 'Auth', 'UrlCache', function ($scope, $state, Auth, UrlCache) {
    var ctrl = this;

    ctrl.login = function () {
        delete ctrl.error;
        Auth.login({
            username: ctrl.loginuser.email,
            password: ctrl.loginuser.password
        }).then(function () {
            UrlCache.reset();
            $scope.$broadcast('elyoos.login');
            $state.go('home');
        }, function () {
            ctrl.error = "Benuztername existiert nicht oder das Passwort ist falsch!";
        });
    };
}];