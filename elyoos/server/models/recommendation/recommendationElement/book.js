'use strict';

let cdn = require('elyoos-server-lib').cdn;

let getRecommendationElement = function (pinwallElement) {

    let element = {};
    element.label = 'Book';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.url = cdn.getUrl(`pages/${element.pageId}/thumbnail.jpg`);
    element.topic = pinwallElement.recommendationElement.topic;
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
