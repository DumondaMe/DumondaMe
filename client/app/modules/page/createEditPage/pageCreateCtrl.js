'use strict';

module.exports = ['$scope', '$state', 'PageLeftNavElements',
    function ($scope, $state, PageLeftNavElements) {

        $scope.mode = {edit: false};
        $scope.category = {};
        $scope.page = {};
        $scope.state = {actual: 1, previous: 1};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.abortCreatePage = function () {
            $state.go('page.overview');
        };
    }];
