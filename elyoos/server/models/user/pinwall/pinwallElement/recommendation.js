'use strict';

let profileUrl = require('./profileUrl');
let cdn = require('elyoos-server-lib').cdn;
let numberOfRecommendation = require('./numberOfRecommendation');

let addLabelElement = function (element, pinwallElement) {
    if (element.label === 'Link') {
        element.link = pinwallElement.pinwallData.link;
        element.hostname = pinwallElement.pinwallData.hostname;
        element.heightPreviewImage = pinwallElement.pinwallData.heightPreviewImage;
        if (element.heightPreviewImage) {
            element.previewUrl = cdn.getUrl(`pages/${element.pageId}/preview.jpg`);
        }
    } else if (element.label === 'Book') {
        element.previewUrl = cdn.getUrl(`pages/${element.pageId}/pagePreview.jpg`);
    } else if (element.label === 'Generic') {
        element.previewUrl = cdn.getUrl(`pages/${element.pageId}/preview.jpg`);
    } else if (element.label === 'Youtube') {
        element.link = pinwallElement.pinwallData.link;
        element.linkEmbed = pinwallElement.pinwallData.linkEmbed;
    }
};

let getPinwallElement = function (pinwallElement) {
    let element = {};
    element.pinwallType = 'Recommendation';
    element.created = pinwallElement.pinwall.created;
    element.label = pinwallElement.pinwallData.label;
    element.pageId = pinwallElement.pinwallData.pageId;
    element.description = pinwallElement.pinwallData.description;
    element.title = pinwallElement.pinwallData.title;
    element.topic = pinwallElement.pinwallData.topic;
    element.isAdmin = pinwallElement.isAdmin;
    element.recommendedByUser = pinwallElement.recommendedByUser;
    element.userRecommendationId = pinwallElement.userRecommendationId;
    element.recommendedByUser = false;
    if(element.userRecommendationId) {
        element.recommendedByUser = true;
    }
    element.thisRecommendationByUser = pinwallElement.thisRecommendationByUser;
    element.totalNumberOfRecommendations = numberOfRecommendation.getNumberOfRecommendation(pinwallElement);
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    profileUrl.addProfileUrl(element, pinwallElement);
    addLabelElement(element, pinwallElement);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
