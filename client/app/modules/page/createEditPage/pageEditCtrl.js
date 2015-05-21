'use strict';

module.exports = ['$scope', '$state', 'PageLeftNavElements',
    function ($scope, $state, PageLeftNavElements) {

        $scope.mode = {edit: true};
        $scope.category = {};
        $scope.page = {};
        $scope.state = {actual: 3, previous: 3};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

    }];
