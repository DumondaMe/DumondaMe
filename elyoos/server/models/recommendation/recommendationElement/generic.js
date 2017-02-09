'use strict';

let cdn = require('elyoos-server-lib').cdn;

let compare = function (a, b) {
    if (a.addressId < b.addressId) {
        return -1;
    } else if (a.addressId > b.addressId) {
        return 1;
    }
    return 0;
};

let getRecommendationElement = function (pinwallElement) {

    let element = {};
    element.label = 'Generic';
    element.pageId = pinwallElement.recommendationElement.pageId;
    element.title = pinwallElement.recommendationElement.title;
    element.topic = pinwallElement.recommendationElement.topic;
    element.url = cdn.getUrl(`pages/${element.pageId}/thumbnail.jpg`);
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    if (pinwallElement.hasOwnProperty("addresses")) {
        element.addresses = pinwallElement.addresses;
        element.addresses.sort(compare);
    }
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
