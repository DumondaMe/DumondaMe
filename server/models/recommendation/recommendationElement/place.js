'use strict';

var cdn = require('../../util/cdn');

var compare = function (a, b) {
    if (a.description < b.description) {
        return -1;
    } else if (a.description > b.description) {
        return 1;
    }
    return 0;
};

var getRecommendationElement = function (pinwallElement) {

    var element = {};
    element.label = 'Place';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.topic = pinwallElement.recommendationElement.topic;
    element.thumbnail = cdn.getUrl(`pages/${element.pageId}/thumbnail.jpg`);
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.places = pinwallElement.places;
    element.places.sort(compare);
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
