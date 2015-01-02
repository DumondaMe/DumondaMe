'use strict';

module.exports = ['$scope', '$rootScope', '$state', 'Auth', function ($scope, $rootScope, $state, Auth) {
    $rootScope.logout = function () {
        Auth.logout().then(function () {
            $rootScope.user = undefined;
            $scope.logoutMessage = "Sie haben sich erfolgreich abgemeldet.";
            $state.go('public.logout');
        }, function () {
            $scope.logoutMessage = "Fehler beim Abmelden";
        });
    };
}];
