'use strict';

module.exports = ['$scope', '$rootScope', 'UserData', function ($scope, $rootScope, UserData) {

    $scope.updateUser = function () {
        UserData.getUserData().then(function (data) {
            $rootScope.user = data;
            $rootScope.user.profilePath = '/api/user/profile/image';
        }, function (error) {
            $rootScope.error = error;
        });
    };
    $scope.updateUser();
}];
