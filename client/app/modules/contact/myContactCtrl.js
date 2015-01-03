'use strict';

module.exports = ['$scope', '$http', '_', function ($scope, $http, _) {

    $scope.query = "";

    $http({method: 'GET', url: '/api/user/contact'})
        .then(function (data) {
            $scope.contacts = data.data.contacts;
            $scope.statistics = data.data.statistic;
            $scope.types = [];
            _.each(data.data.statistic, function (stat) {
                $scope.types.push(stat.type);
            });
            $scope.numberOfContacts = data.data.numberOfContacts;
        });
}];
