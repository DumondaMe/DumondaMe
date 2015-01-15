'use strict';


var resetPagination = function ($scope, totalItems) {
    $scope.currentPagination = 1;
    $scope.currentPaginationRange = Math.ceil(totalItems / $scope.itemsPerPage);
};

var controller = function ($scope) {
    $scope.currentPagination = 1;
    $scope.currentPaginationRange = 1;

    $scope.$watch($scope.totalItems, function (newTotalItems) {
        if (newTotalItems && $scope.itemsPerPage) {
            newTotalItems = parseInt(newTotalItems, 10);
            resetPagination($scope, newTotalItems);
        }
    });

    $scope.$watch($scope.resetCounter, function (newTotalItems) {
        if (newTotalItems && $scope.itemsPerPage) {
            $scope.currentPagination = 1;
        }
    });

    $scope.clickPagination = function (itemNumber) {
        $scope.currentPagination = itemNumber;
        $scope.getPaginationSet($scope.currentPagination);
    };
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
};

module.exports = {
    directive: [function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                totalItems: '&',
                itemsPerPage: '@',
                getPaginationSet: '=',
                resetCounter: '&'
            },
            templateUrl: 'app/modules/directives/paginationNextPrevious/template.html',
            controller: controller
        };
    }],
    name: 'elyPaginationNextPrevious'
};
