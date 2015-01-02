'use strict';

module.exports = ['HttpService', '_', function (HttpService, _) {


    this.sendRecommendationUpdate = function ($scope, submitData, recommendationId, url) {

        if (recommendationId) {
            submitData.id = recommendationId;
        }

        HttpService.sendPostRequest(submitData, url).then(function (respondData) {
            var updatedRecommendation;
            $scope.headerState = "showRecommendation";
            if (recommendationId) {
                updatedRecommendation = _.find($scope.user.recommendations, function (value) {
                    return value.id === recommendationId;
                });
                updatedRecommendation.author = submitData.author;
                updatedRecommendation.link = submitData.link;
                updatedRecommendation.title = submitData.title;
                updatedRecommendation.ratingPositive = submitData.ratingPositive;
                updatedRecommendation.comment = submitData.comment;
            } else {
                submitData.id = respondData.id;
                $scope.user.recommendations.push(submitData);
            }
            $scope.submitFailedToServer = false;
            $scope.successUserDataChange = true;
        }, function () {
            $scope.submitFailedToServer = true;
            $scope.successUserDataChange = false;
        });
    };
    this.sendRecommendationDelete = function ($scope, submitData, url) {
        HttpService.sendDeleteRequest(submitData, url).then(function () {
            $scope.headerState = "showRecommendation";
            $scope.user.recommendations = _.without($scope.user.recommendations,
                _.findWhere($scope.user.recommendations, {id: submitData.id}));
            $scope.submitFailedToServer = false;
            $scope.successUserDataChange = true;
        }, function () {
            $scope.submitFailedToServer = true;
            $scope.successUserDataChange = false;
        });
    };

}];