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

        profileImage.addProfileImageChangedEvent($rootScope, function () {
            userHeaderInfo = UserInfo.get(null, function () {
                $rootScope.userHeaderInfo = userHeaderInfo;
            });
        });

        $scope.$on('$destroy', function () {
            $interval.cancel(modificationInfo);
            delete $rootScope.userHeaderInfo;
        });

        if ($rootScope.userHeaderInfo === undefined) {
            userHeaderInfo = UserInfo.get(null, function () {
                $rootScope.userHeaderInfo = userHeaderInfo;
            });
        }

        $rootScope.logout = function () {
            Auth.logout().then(function () {
                $state.go('public.login');
            }, function () {
                $scope.error = "Fehler beim Abmelden";
            });
        };
    }];
