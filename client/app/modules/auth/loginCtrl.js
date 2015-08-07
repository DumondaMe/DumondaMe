'use strict';

module.exports = ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {
    $scope.login = function () {
        delete $scope.error;
        Auth.login({
            username: $scope.loginuser.email,
            password: $scope.loginuser.password
        }).then(function () {
            $scope.$broadcast('elyoos.login');
            $state.go('home');
        }, function () {
            $scope.error = "Passwort oder Kennwort stimmen nicht.";
        });
    };
}];
