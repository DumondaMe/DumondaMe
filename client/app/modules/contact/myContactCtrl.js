'use strict';

module.exports = ['$scope', '$http', '_', function ($scope, $http, _) {

    $scope.query = "";

    $http({method: 'GET', url: '/api/user/contact'})
        .then(function (data) {
            $scope.contacts = data.data;
            if ($scope.contacts) {
                $scope.contacts.desc = [];
                _.each($scope.contacts.count_desc, function (count_desc) {
                    $scope.contacts.desc.push(count_desc.key);
                });
            }
        });
}];
