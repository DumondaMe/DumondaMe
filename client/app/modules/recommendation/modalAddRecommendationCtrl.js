'use strict';

module.exports = ['$scope', 'PageRecommendation', function ($scope, PageRecommendation) {
    $scope.numberOfSelectedStars = -1;

    $scope.addRecommendation = function ($hide) {
        delete $scope.error;
        PageRecommendation.save({
            pageId: $scope.recommendation.pageId,
            label: $scope.recommendation.label,
            comment: $scope.recommendationDescription,
            rating: $scope.numberOfSelectedStars
        }, function () {
            $hide();
        }, function () {
            $scope.error = 'Bewertung konnte nicht gespeicher werden';
        });
    };
}];
