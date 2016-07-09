'use strict';

var getRecommendationElement = function (pinwallElement) {

    var element = {};
    element.label = 'Book';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.description = pinwallElement.recommendationElement.description;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.language = pinwallElement.recommendationElement.language;
    element.topic = pinwallElement.recommendationElement.topic;
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
