'use strict';

module.exports = ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.login = function () {
        Auth.login({
            username: $scope.loginuser.email,
            password: $scope.loginuser.password
        }).then(function () {
            $location.path('/');
            $scope.updateUser();
        }, function () {
            $scope.error = "Failed to login";
        });
    };
}];
