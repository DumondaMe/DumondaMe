'use strict';

var getRecommendationElement = function (pinwallElement) {

    var element = {};
    element.label = 'Place';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.places = pinwallElement.places;
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
