'use strict';

let profileUrl = require('./profileUrl');
let cdn = require('elyoos-server-lib').cdn;

let addLabelElement = function (element, page) {
    if (element.label === 'Link') {
        element.link = page.link;
        element.hostname = page.hostname;
        element.heightPreviewImage = page.heightPreviewImage;
        if (element.heightPreviewImage) {
            element.previewUrl = cdn.getUrl(`pages/${element.pageId}/preview.jpg`);
        }
    } else if (element.label === 'Book') {
        element.previewUrl = cdn.getUrl(`pages/${element.pageId}/pagePreview.jpg`);
    } else if (element.label === 'Generic') {
        element.previewUrl = cdn.getUrl(`pages/${element.pageId}/preview.jpg`);
    } else if (element.label === 'Youtube') {
        element.link = page.link;
        element.linkEmbed = page.linkEmbed;
    }
};

let getPinwallElement = function (pinwallElement) {
    let element = {};
    element.pinwallType = 'Recommendation';
    element.created = pinwallElement.created || pinwallElement.page.created;
    element.label = pinwallElement.page.label;
    element.pageId = pinwallElement.page.pageId;
    element.description = pinwallElement.page.description;
    element.title = pinwallElement.page.title;
    element.topic = pinwallElement.page.topic;
    element.userRecommendationId = pinwallElement.userRecommendationId;
    element.recommendedByUser = false;
    if (element.userRecommendationId) {
        element.recommendedByUser = true;
    }
    element.isAdmin = pinwallElement.isAdmin;
    element.totalNumberOfRecommendations = pinwallElement.totalNumberOfRecommendations;
    element.numberOfContactRecommendations = pinwallElement.numberOfContactRecommendations;
    profileUrl.addProfileUrl(element, pinwallElement, 'admin');
    addLabelElement(element, pinwallElement.page);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
