'use strict';

module.exports = ['$scope', '$state', 'PageLeftNavElements',
    function ($scope, $state, PageLeftNavElements) {

        $scope.category = {};
        $scope.page = {};
        $scope.state = {actual: 1, previous: 1};

        $scope.$emit(PageLeftNavElements.event, PageLeftNavElements.elements);

        $scope.setNextState = function (newState) {
            if (newState !== $scope.state.actual) {
                $scope.state.previous = $scope.state.actual;
                $scope.state.actual = newState;
            }
        };

        $scope.setPreviousState = function () {
            $scope.state.actual = $scope.state.previous;
        };

        $scope.abortCreatePage = function () {
            $state.go('page.overview');
        };

        $scope.suggestionContinue = function () {
            $scope.setNextState(3);
        };
    }];
