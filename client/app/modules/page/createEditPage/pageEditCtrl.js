'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'PageLeftNavElements', 'PageCategories', 'PageDetail',
    function ($scope, $state, $stateParams, PageLeftNavElements, PageCategories, PageDetail) {

        $scope.mode = {edit: true};
        $scope.category = {};
        $scope.page = {};
        $scope.state = {actual: 3, previous: 3};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.abortCreateEditPage = function () {
            $state.go('page.detail', {
                pageId: $stateParams.pageId,
                label: $stateParams.label
            });
        };

        $scope.pageDetail = PageDetail.get({pageId: $stateParams.pageId, label: $stateParams.label}, function () {
            var subCategory;
            $scope.category.selectedCategory = PageCategories.categories[$stateParams.label].description;
            if ($scope.pageDetail.page.subCategory) {
                subCategory = PageCategories.categories[$stateParams.label].subCategory[$scope.pageDetail.page.subCategory];
                if (subCategory) {
                    $scope.category.selectedSubCategory = subCategory.description;
                }
            }
        });
    }];
