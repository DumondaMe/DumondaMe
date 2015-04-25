'use strict';

module.exports = ['$scope', 'PageRecommendation', function ($scope, PageRecommendation) {
    $scope.numberOfSelectedStars = -1;

    $scope.addRecommendation = function () {
        var data = {
            pageId: $scope.recommendation.pageId,
            label: $scope.recommendation.label,
            comment: $scope.recommendationDescription,
            rating: $scope.numberOfSelectedStars
        };

        delete $scope.error;
        PageRecommendation.save(data, function (res) {
            data.profileUrl = res.profileUrl;
            data.recommendationId = res.recommendationId;
            $scope.confirm(data);
        }, function () {
            $scope.error = 'Bewertung konnte nicht gespeicher werden';
        });
    };
}];
