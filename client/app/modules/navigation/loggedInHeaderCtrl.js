'use strict';

module.exports = ['$scope', '$rootScope', 'UserInfo', function ($scope, $rootScope, UserInfo) {

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

    if ($rootScope.userHeaderInfo === undefined) {
        userHeaderInfo = UserInfo.get(null, function () {
            $rootScope.userHeaderInfo = userHeaderInfo;
        });
    }
}];
