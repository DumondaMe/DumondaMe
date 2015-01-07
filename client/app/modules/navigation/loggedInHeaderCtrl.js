'use strict';

module.exports = ['$scope', function ($scope) {

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
}];
