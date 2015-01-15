'use strict';

var getRequestForSelectedTypes = function ($scope, $http, paginationNumber) {
    var types = '', skip;
    angular.forEach($scope.users.statistics, function (stat) {
        if (stat.selected === true) {
            if (types.length === 0) {
                types = types.concat(stat.type);
            } else {
                types = types.concat(',', stat.type);
            }
        }
    });

    if (types.length > 0) {
        skip = (paginationNumber - 1) * $scope.itemsPerPage;
        $http({
            method: 'GET',
            url: '/api/user/contact',
            params: {itemsPerPage: $scope.itemsPerPage, skip: skip, types: types}
        })
            .then(function (data) {
                $scope.users.contacts = data.data.contacts;
                $scope.users.contactsForPagination = data.data.contactsForPagination;
                $scope.isUserSearch = false;
            });
    } else {
        $scope.getContacts(1);
    }
};

module.exports = ['$scope', '$http', '_', function ($scope, $http, _) {

    $scope.query = "";
    $scope.users = {};
    $scope.users.resetCounter = 1;
    $scope.itemsPerPage = 10;
    $scope.isUserSearch = false;
    $scope.allContactsSelected = true;

    $scope.selectedAllContacts = function () {
        $scope.getContacts(1);
    };

    $scope.selectedStatisticType = function (stat) {
        $scope.allContactsSelected = false;
        stat.selected = !stat.selected;
        getRequestForSelectedTypes($scope, $http, 1);
    };

    $scope.paginationChanged = function (paginationNumber) {
        if ($scope.allContactsSelected) {
            $scope.getContacts(paginationNumber);
        } else {
            getRequestForSelectedTypes($scope, $http, paginationNumber);
        }
    };

    $scope.getContacts = function (paginationNumber) {

        var skip = (paginationNumber - 1) * $scope.itemsPerPage;
        $http({
            method: 'GET',
            url: '/api/user/contact',
            params: {itemsPerPage: $scope.itemsPerPage, skip: skip}
        })
            .then(function (data) {
                $scope.users.contacts = data.data.contacts;
                $scope.users.statistics = data.data.statistic;
                $scope.users.types = [];
                $scope.allContactsSelected = true;
                angular.forEach($scope.users.statistics, function (stat) {
                    stat.selected = false;
                    $scope.users.types.push(stat.type);
                });
                if (paginationNumber === 1) {
                    $scope.users.resetCounter = $scope.users.resetCounter + 1;
                }
                $scope.users.numberOfContacts = data.data.numberOfContacts;
                $scope.users.contactsForPagination = data.data.contactsForPagination;
                $scope.isUserSearch = false;
            });
    };

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
        $scope.getContacts(1);
    };

    $scope.getUser = function (searchValue) {
        if (searchValue && searchValue.length > 0) {
            $http({
                method: 'GET',
                url: '/api/user/contact/search',
                params: {search: searchValue, maxItems: 20, isSuggestion: false}
            })
                .then(function (res) {
                    $scope.users.contacts = res.data;
                    $scope.isUserSearch = true;
                    $scope.allContactsSelected = false;
                    angular.forEach($scope.users.statistics, function (stat) {
                        stat.selected = false;
                    });
                });
        } else {
            $scope.getContacts(1);
        }
    };
}];
