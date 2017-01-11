'use strict';

let getRecommendationElement = function (pinwallElement) {
    let element = {};
    element.label = 'Youtube';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.linkEmbed = pinwallElement.recommendationElement.linkEmbed;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.topic = pinwallElement.recommendationElement.topic;
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
