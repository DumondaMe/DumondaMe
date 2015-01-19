'use strict';

module.exports = ['$scope', '$rootScope', 'UserInfo', function ($scope, $rootScope, UserInfo) {

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

    if ($rootScope.userHeaderInfo === undefined) {
        $rootScope.userHeaderInfo = UserInfo.get();
    }
}];
