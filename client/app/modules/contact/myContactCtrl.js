'use strict';

var getRequestForSelectedTypes = function ($scope, Contact, paginationNumber) {
    var types = '', skip, users;
    angular.forEach($scope.users.statistic, function (stat) {
        if (stat.selected) {
            if (types.length === 0) {
                types = types.concat(stat.type);
            } else {
                types = types.concat(',', stat.type);
            }
        }
    });

    if (types.length > 0) {
        skip = (paginationNumber - 1) * $scope.itemsPerPage;

        users = Contact.get({
            itemsPerPage: $scope.itemsPerPage,
            skip: skip,
            types: types
        }, function () {
            $scope.users.contacts = users.contacts;
            $scope.users.contactsForPagination = users.contactsForPagination;
            $scope.isUserSearch = false;
        });
    } else {
        $scope.getContacts(1);
    }
};

module.exports = ['$scope', 'SearchUsers', 'Contact', function ($scope, SearchUsers, Contact) {

    $scope.query = "";
    $scope.resetCounter = 1;
    $scope.itemsPerPage = 10;
    $scope.isUserSearch = false;
    $scope.allContactsSelected = true;

    $scope.selectedAllContacts = function () {
        $scope.getContacts(1);
    };

    $scope.selectedStatisticType = function (stat) {
        $scope.allContactsSelected = false;
        stat.selected = !stat.selected;
        getRequestForSelectedTypes($scope, Contact, 1);
    };

    $scope.paginationChanged = function (paginationNumber) {
        if ($scope.allContactsSelected) {
            $scope.getContacts(paginationNumber);
        } else {
            getRequestForSelectedTypes($scope, Contact, paginationNumber);
        }
    };

    $scope.getContacts = function (paginationNumber) {

        var skip = (paginationNumber - 1) * $scope.itemsPerPage;

        $scope.users = Contact.get({itemsPerPage: $scope.itemsPerPage, skip: skip}, function () {
            $scope.allContactsSelected = true;
            if (paginationNumber === 1) {
                $scope.resetCounter = $scope.resetCounter + 1;
            }
            $scope.isUserSearch = false;
        });
    };

    $scope.getUserSuggestion = function (searchValue) {
        if (searchValue && searchValue.trim().length > 0) {
            return SearchUsers.query({
                search: searchValue,
                maxItems: 7,
                isSuggestion: true
            }).$promise;
        }
        $scope.getContacts(1);
    };

    $scope.getUser = function (searchValue) {
        var users;
        if (searchValue && searchValue.trim().length > 0) {
            users = SearchUsers.query({
                search: searchValue,
                maxItems: 20,
                isSuggestion: false
            }, function () {
                $scope.users.contacts = users;
                $scope.isUserSearch = true;
                $scope.allContactsSelected = false;
                angular.forEach($scope.users.statistic, function (stat) {
                    stat.selected = false;
                });
            });
        } else {
            $scope.getContacts(1);
        }
    };
}];
