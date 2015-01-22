'use strict';


module.exports = ['$scope', 'Contacting', function ($scope, Contacting) {

    $scope.resetCounter = 1;
    $scope.itemsPerPage = 10;

    $scope.getContacting = function (paginationNumber) {

        var skip = (paginationNumber - 1) * $scope.itemsPerPage;

        $scope.users = Contacting.get({itemsPerPage: $scope.itemsPerPage, skip: skip}, function () {
            if (paginationNumber === 1) {
                $scope.resetCounter = $scope.resetCounter + 1;
            }
        });
    };
    $scope.getContacting(1);
}];
