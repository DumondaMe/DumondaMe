'use strict';
var cdn = require('../../util/cdn');

var getRecommendationElement = function (pinwallElement) {

    var element = {};
    element.label = 'Link';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.topic = pinwallElement.recommendationElement.topic;
    if (pinwallElement.recommendationElement.hasOwnProperty('heightPreviewImage')) {
        element.url = cdn.getUrl(`pages/${element.pageId}/thumbnail.jpg`);
    }
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
