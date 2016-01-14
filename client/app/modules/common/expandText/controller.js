'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.expand = function () {
                $scope.expanded = true;
                if ($scope.maxHeight) {
                    $scope.descriptionStyle = {'max-height': $scope.maxHeight, 'overflow-y': 'auto'};
                } else {
                    $scope.descriptionStyle = {'max-height': 'none'};
                }

            };
        }];
    }
};
