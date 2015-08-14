'use strict';

var setStars = function (starValue, $scope) {
    var i;
    for (i = 0; i < 5; i++) {
        if (i <= starValue) {
            $scope['star' + i] = 'full';
        } else if (i - 0.75 <= starValue && i - 0.2 > starValue) {
            $scope['star' + i] = 'half';
        } else {
            $scope['star' + i] = 'empty';
        }
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.star0 = 'empty';
            $scope.star1 = 'empty';
            $scope.star2 = 'empty';
            $scope.star3 = 'empty';
            $scope.star4 = 'empty';

            $scope.isReadonly = $scope.isReadonly === 'true';
            $scope.isSmall = $scope.isSmall === 'true';
            $scope.isXSmall = $scope.isXSmall === 'true';

            $scope.mouseOverStar = function (star) {
                if (!$scope.isReadonly) {
                    setStars(star, $scope);
                }
            };

            $scope.resetToSelected = function () {
                if (!$scope.isReadonly) {
                    setStars($scope.numberOfSelectedStars - 1, $scope);
                }
            };

            $scope.starSelected = function (star) {
                if (!$scope.isReadonly) {
                    $scope.numberOfSelectedStars = star;
                }
            };

            $scope.$watch($scope.numberOfSelectedStarsReadonly, function (newValue) {
                if (newValue && newValue > 0) {
                    setStars(newValue - 1, $scope);
                }
            });

        }];
    }
};
