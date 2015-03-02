'use strict';

module.exports = ['$scope', '$interval', '$rootScope', 'UserInfo', 'Modification', 'profileImage',
    function ($scope, $interval, $rootScope, UserInfo, Modification, profileImage) {

        var userHeaderInfo, modificationInfo;
        $scope.dropdownSettings = [
            {
                text: "Settings",
                href: "#"
            },
            {
                divider: true
            },
            {
                text: "Logout",
                click: "logout()"
            }
        ];

        modificationInfo = $interval(function () {
            var modification = Modification.get(null, function () {
                if (modification.hasChanged) {
                    $rootScope.$broadcast('message.changed');
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
    }];
