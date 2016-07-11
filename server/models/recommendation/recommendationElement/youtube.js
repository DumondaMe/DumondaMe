'use strict';

var getRecommendationElement = function (pinwallElement) {
    var element = {};
    element.label = 'Youtube';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.link = pinwallElement.recommendationElement.link;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.topic = pinwallElement.recommendationElement.topic;
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
