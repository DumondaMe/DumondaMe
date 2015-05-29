'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', '$state', 'Languages', 'PageCategories', function ($scope, $state, Languages, PageCategories) {
            $scope.longFormat = $scope.longFormat === 'true';
            $scope.landscapeFormat = $scope.landscapeFormat === 'true';

            $scope.$watchCollection('pagePreview', function (newValue) {
                if (newValue) {
                    $scope.pagePreview.languageShow = Languages.getLanguage($scope.pagePreview.language);
                    $scope.pagePreview.labelShow = PageCategories.categories[$scope.pagePreview.label].description;
                }
            });

            $scope.openDetail = function (pageId, label) {
                $state.go('page.detail', {
                    label: label,
                    pageId: pageId
                });
            };
        }];
    }
};
