'use strict';
let cdn = require('elyoos-server-lib').cdn;

let getRecommendationElement = function (pinwallElement) {

    let element = {};
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
