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
    }];
