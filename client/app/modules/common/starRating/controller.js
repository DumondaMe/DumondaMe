'use strict';

var setStars = function (starValue, $scope) {

    function setStar (index, iconName) {
        if($scope.star.length < 5) {
            $scope.star.push(iconName);
        } else {
            $scope.star[index] = iconName;
        }
    }

    var i;
    for (i = 0; i < 5; i++) {
        if (i <= starValue) {
            setStar(i, 'full');
        } else if (i - 0.7 <= starValue && i > starValue) {
            setStar(i, 'half');
        } else {
            setStar(i, 'empty');
        }
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.isSmall = $scope.isSmall === 'true';
            $scope.isXSmall = $scope.isXSmall === 'true';

            if (!$scope.isReadonly) {
                $scope.star = ['empty', 'empty', 'empty', 'empty', 'empty'];
            } else {
                $scope.star = [];
            }

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
                } else {
                    $scope.star = ['empty', 'empty', 'empty', 'empty', 'empty'];
                }
            });

        }];
    }
};
