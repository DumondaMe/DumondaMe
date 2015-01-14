'use strict';

module.exports = ['$scope', '$rootScope', 'HttpService', function ($scope, $rootScope, HttpService) {

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
        HttpService.sendGetRequest('api/user/userInfo').then(function (data) {
            $rootScope.userHeaderInfo = data;
        });
    }
}];
