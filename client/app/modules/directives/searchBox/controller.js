'use strict';

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {
            $scope.sendGetUser = function ($event) {
                if ($event.keyCode === 13) {
                    $scope.getUser($scope.query);
                }
            };

            $scope.$on('$typeahead.select', function (value, index) {
                $scope.getUser(index);
            });
        }];
    }
};
