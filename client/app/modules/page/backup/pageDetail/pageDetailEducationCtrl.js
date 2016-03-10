'use strict';

module.exports = ['$scope',
    function ($scope) {

        $scope.$watch('pageDetail.course', function (newPageDetails) {
            if (newPageDetails) {
                angular.forEach(newPageDetails, function (detail) {
                    detail.label = 'Course';
                });
            }
        });
    }];
