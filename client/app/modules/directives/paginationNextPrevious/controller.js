'use strict';

var resetPagination = function ($scope, totalItems) {
    $scope.currentPagination = 1;
    $scope.currentPaginationRange = Math.ceil(totalItems / $scope.itemsPerPage);
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {
            var lastValidTotalItems;
            $scope.currentPagination = 1;
            $scope.currentPaginationRange = 1;

            $scope.$watch($scope.totalItems, function (newTotalItems) {
                if (newTotalItems && $scope.itemsPerPage) {
                    newTotalItems = parseInt(newTotalItems, 10);
                    if (!lastValidTotalItems || newTotalItems !== lastValidTotalItems) {
                        lastValidTotalItems = newTotalItems;
                        resetPagination($scope, newTotalItems);
                    }
                }
            });

            $scope.$watch($scope.resetCounter, function (newTotalItems) {
                if (newTotalItems && $scope.itemsPerPage) {
                    $scope.currentPagination = 1;
                }
            });

            $scope.clickPrevious = function () {
                if ($scope.currentPagination > 1) {
                    $scope.currentPagination = $scope.currentPagination - 1;
                    $scope.getPaginationSet($scope.currentPagination);
                }
            };

            $scope.clickNext = function () {
                if ($scope.currentPagination < $scope.currentPaginationRange) {
                    $scope.currentPagination = $scope.currentPagination + 1;
                    $scope.getPaginationSet($scope.currentPagination);
                }
            };
        }];
    }
};
