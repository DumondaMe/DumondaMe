'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {
            $scope.sendGetQuery = function ($event) {
                if ($event.keyCode === 13) {
                    $scope.getQuery($scope.query);
                }
            };

            $scope.$on('$typeahead.select', function (value, index) {
                $scope.getQuery(index);
            });
        }];
    }
};
