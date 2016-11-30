'use strict';

module.exports = [function () {

    this.handlingResponse = function (newRecommendations, previousRecommendations) {
        newRecommendations.recommendations = previousRecommendations.concat(newRecommendations.recommendations);
    };

    this.checkRequestPinwall = function (recommendations, requestedNumberOfElements) {
        return recommendations.recommendations.length === requestedNumberOfElements;
    };
}];
