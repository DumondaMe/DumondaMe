'use strict';

module.exports = ['$scope', '$http', '_', function ($scope, $http, _) {

    $scope.query = "";

    $scope.getContacts = function () {

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
    };
    $scope.getContacts();

    $scope.getUserSuggestion = function (searchValue) {
        if (searchValue && searchValue.length > 0) {
            return $http({
                method: 'GET',
                url: '/api/user/contact/search',
                params: {search: searchValue, maxItems: 7, isSuggestion: true}
            })
                .then(function (res) {
                    return res.data;
                });
        }
        $scope.getContacts();
    };

    $scope.getUser = function (searchValue) {
        if (searchValue && searchValue.length > 0) {
            $http({
                method: 'GET',
                url: '/api/user/contact/search',
                params: {search: searchValue, maxItems: 20, isSuggestion: false}
            })
                .then(function (res) {
                    $scope.contacts = res.data;
                });
        } else {
            $scope.getContacts();
        }
    };
}];
