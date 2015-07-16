'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.expand = function () {
                $scope.expanded = true;
                $scope.descriptionStyle = {'max-height': 'none'};
            };
        }];
    }
};
