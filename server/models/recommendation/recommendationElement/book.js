'use strict';

var cdn = require('../../util/cdn');

var getRecommendationElement = function (pinwallElement) {

    var element = {};
    element.label = 'Book';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.url = cdn.getUrl(`pages/${element.pageId}/pagePreview.jpg`);
    element.topic = pinwallElement.recommendationElement.topic;
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
