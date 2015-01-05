'use strict';

var setPaginationRange = function ($scope, startIndex) {
    var i;
    for (i = startIndex; i <= $scope.currentPaginationRange; i = i + 1) {
        $scope.currentPaginationItems.push(i);
    }
};

var controller = function ($scope) {
    var paginationElements = parseInt($scope.paginationElements, 10);
    $scope.currentPagination = 1;
    $scope.currentPaginationRange = 1;
    $scope.currentPaginationMaxRange = 1;
    $scope.currentPaginationItems = [];

    $scope.$watch($scope.totalItems, function (newTotalItems) {
        if (newTotalItems && $scope.itemsPerPage) {
            newTotalItems = parseInt(newTotalItems, 10);
            $scope.currentPaginationItems = [];
            $scope.currentPaginationMaxRange = Math.ceil(newTotalItems / $scope.itemsPerPage);
            if ($scope.currentPaginationMaxRange >= paginationElements) {
                $scope.currentPaginationRange = paginationElements;
            } else {
                $scope.currentPaginationRange = $scope.currentPaginationMaxRange;
            }

            setPaginationRange($scope, 1);
        }
    });

    $scope.clickPagination = function (itemNumber) {
        $scope.currentPagination = itemNumber;
        $scope.getPaginationSet($scope.currentPagination);
    };
    $scope.clickPrevious = function () {
        var i;
        if ($scope.currentPagination > 1) {
            $scope.currentPagination = $scope.currentPagination - 1;
            if ($scope.currentPaginationItems.length > 0 && $scope.currentPagination < $scope.currentPaginationItems[0]) {
                $scope.currentPaginationItems = [];
                for (i = $scope.currentPagination - paginationElements + 1; i <= $scope.currentPagination; i = i + 1) {
                    if (i > 0) {
                        $scope.currentPaginationItems.push(i);
                    }
                }
                $scope.currentPaginationRange = $scope.currentPagination;
            }
            $scope.getPaginationSet($scope.currentPagination);
        }
    };

    $scope.clickNext = function () {
        var i;
        if ($scope.currentPagination < $scope.currentPaginationMaxRange) {
            $scope.currentPagination = $scope.currentPagination + 1;
            if ($scope.currentPagination > $scope.currentPaginationRange) {
                $scope.currentPaginationItems = [];
                for (i = $scope.currentPagination; (i <= $scope.currentPaginationMaxRange) && (i < $scope.currentPagination + paginationElements); i = i + 1) {
                    $scope.currentPaginationItems.push(i);
                }
                $scope.currentPaginationRange = i - 1;
            }
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
                paginationElements: '@',
                totalItems: '&',
                itemsPerPage: '@',
                getPaginationSet: '='
            },
            templateUrl: 'app/modules/directives/pagination/template.html',
            controller: controller
        };
    }],
    name: 'elyPagination'
};
