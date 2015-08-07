'use strict';

module.exports = ['$scope', '$rootScope', '$state', 'Auth', 'UrlCache', function ($scope, $rootScope, $state, Auth, UrlCache) {
    $scope.login = function () {
        delete $scope.error;
        Auth.login({
            username: $scope.loginuser.email,
            password: $scope.loginuser.password
        }).then(function () {
            UrlCache.reset();
            $scope.$broadcast('elyoos.login');
            $state.go('home');
        }, function () {
            $scope.error = "Passwort oder Kennwort stimmen nicht.";
        });
    };
}];
