'use strict';

module.exports = ['$scope', 'Page', function ($scope, Page) {

    $scope.itemsPerPage = 30;

    $scope.page = Page.get({maxItems: $scope.itemsPerPage, skip: 0, isSuggestion: false});
}];
