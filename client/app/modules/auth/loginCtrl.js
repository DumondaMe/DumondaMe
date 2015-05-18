'use strict';

module.exports = ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.login = function () {
        delete $scope.error;
        Auth.login({
            username: $scope.loginuser.email,
            password: $scope.loginuser.password
        }).then(function () {
            $scope.$broadcast('elyoos.login');
            $location.path('/');
        }, function () {
            $scope.error = "Passwort oder Kennwort stimmen nicht.";
        });
    };
}];
