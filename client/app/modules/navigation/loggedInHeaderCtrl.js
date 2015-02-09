'use strict';

module.exports = ['$scope', '$rootScope', 'UserInfo', 'profileImage', function ($scope, $rootScope, UserInfo, profileImage) {

    var userHeaderInfo;
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

    profileImage.addProfileImageChangedEvent($rootScope, 'userHeaderInfo');

    if ($rootScope.userHeaderInfo === undefined) {
        userHeaderInfo = UserInfo.get(null, function () {
            $rootScope.userHeaderInfo = userHeaderInfo;
        });
    }
}];
