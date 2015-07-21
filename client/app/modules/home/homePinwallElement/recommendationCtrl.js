'use strict';

module.exports = ['$scope', 'dateFormatter', '$state', 'PageCategories', function ($scope, dateFormatter, $state, PageCategories) {

    $scope.getFormattedDate = dateFormatter.formatRelativeTimes;

    $scope.category = PageCategories.categories[$scope.element.label].description;

    $scope.openDetail = function (pageId, label) {
        $state.go('page.detail', {
            label: label,
            pageId: pageId
        });
    };
}];

