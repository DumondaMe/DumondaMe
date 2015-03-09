'use strict';

module.exports = ['$scope', '$state', '$interval', '$rootScope', 'UserInfo', 'Modification', 'profileImage', 'Auth',
    function ($scope, $state, $interval, $rootScope, UserInfo, Modification, profileImage, Auth) {

        var userHeaderInfo, modificationInfo;

        modificationInfo = $interval(function () {
            var modification = Modification.get(null, function () {
                if (modification.hasChanged) {
                    $rootScope.$broadcast('message.changed', modification.numberOfMessages);
                }
            });
        }, 30000);

        profileImage.addProfileImageChangedEvent($rootScope, 'userHeaderInfo');

        $scope.$on('$destroy', function () {
            $interval.cancel(modificationInfo);
        });

        if ($rootScope.userHeaderInfo === undefined) {
            userHeaderInfo = UserInfo.get(null, function () {
                $rootScope.userHeaderInfo = userHeaderInfo;
            });
        }

        $rootScope.logout = function () {
            Auth.logout().then(function () {
                delete $rootScope.userHeaderInfo;
                $state.go('public.login');
            }, function () {
                $scope.error = "Fehler beim Abmelden";
            });
        };
    }];
