'use strict';

module.exports = ['$scope', '$window', '$interval', '$rootScope', 'UserInfo', 'Modification', 'profileImage', 'Auth',
    function ($scope, $window, $interval, $rootScope, UserInfo, Modification, profileImage, Auth) {

        var modificationInfo, isLoggedIn = false;

        profileImage.addProfileImageChangedEvent($rootScope, function () {
            $rootScope.userHeaderInfo = UserInfo.get(null);
        });

        $rootScope.isLoggedIn = function() {
            if(!isLoggedIn) {
                $rootScope.userHeaderInfo = UserInfo.get(null, function () {
                    isLoggedIn = true;
                    modificationInfo = $interval(function () {
                        var modification = Modification.get(null, function () {
                            if (modification.hasChanged) {
                                $rootScope.$broadcast('message.changed', modification.numberOfMessages);
                            }
                        });
                    }, 30000);
                });
            }
        };

        $rootScope.isLoggedIn();

        $rootScope.logout = function () {
            Auth.logout().then(function () {
                $interval.cancel(modificationInfo);
                isLoggedIn = false;
                $window.location.href = '/login';
            }, function () {
                $scope.error = "Fehler beim Abmelden";
            });
        };
    }];
