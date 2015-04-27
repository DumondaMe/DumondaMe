'use strict';

var setStars = function (starValue, $scope) {
    var i;
    for (i = 0; i < 5; i++) {
        if (i <= starValue) {
            $scope['star' + i] = 'app/img/starRating/starFull.png';
        } else if (i - 0.75 <= starValue && i - 0.2 > starValue) {
            $scope['star' + i] = 'app/img/starRating/starHalf.png';
        } else {
            $scope['star' + i] = 'app/img/starRating/starEmpty.png';
        }
    }
};

module.exports = {
    directiveCtrl: function () {
        return ['$scope', function ($scope) {

            $scope.star0 = 'app/img/starRating/starEmpty.png';
            $scope.star1 = 'app/img/starRating/starEmpty.png';
            $scope.star2 = 'app/img/starRating/starEmpty.png';
            $scope.star3 = 'app/img/starRating/starEmpty.png';
            $scope.star4 = 'app/img/starRating/starEmpty.png';

            $scope.isReadonly = $scope.isReadonly === 'true';
            $scope.isSmall = $scope.isSmall === 'true';

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
