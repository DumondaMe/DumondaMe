'use strict';

module.exports = ['$scope', '$state', 'Page', function ($scope, $state, Page) {

    $scope.itemsPerPage = 30;

    $scope.page = Page.get({maxItems: $scope.itemsPerPage, skip: 0, isSuggestion: false});

    $scope.openDetail = function (pageId, label) {
        $state.go('page.detail', {
            label: label,
            pageId: pageId
        });
    };
}];
