'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.expandBlog = function () {
                if (!$scope.isExpand && !$scope.showExpand) {
                    $scope.isExpand = true;
                }
            };

/*            $scope.abort = function () {
                if ($scope.isExpand && $scope.showExpand) {
                    $scope.isExpand = false;
                }
            };*/
        }];
    }
};

