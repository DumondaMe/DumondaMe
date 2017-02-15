'use strict';

let cdn = require('elyoos-server-lib').cdn;

let addLabelElement = function (element, pinwallElement) {
    if (element.label === 'Link') {
        element.link = pinwallElement.page.link;
        element.hostname = pinwallElement.page.hostname;
        if (pinwallElement.page.hasOwnProperty('heightPreviewImage')) {
            element.previewUrl = cdn.getUrl(`pages/${element.pageId}/preview.jpg`);
        }
    } else if (element.label === 'Book') {
        element.previewUrl = cdn.getUrl(`pages/${element.pageId}/pagePreview.jpg`);
    } else if (element.label === 'Generic') {
        element.previewUrl = cdn.getUrl(`pages/${element.pageId}/preview.jpg`);
    } else if (element.label === 'Youtube') {
        element.link = pinwallElement.page.link;
        element.linkEmbed = pinwallElement.page.linkEmbed;
    } else if (element.label === 'Blog') {
        if (pinwallElement.page.hasOwnProperty('heightPreviewImage')) {
            element.previewUrl = cdn.getUrl(`blog/${element.pageId}/preview.jpg`);
        }
    }
};

let getPinwallElement = function (pinwallElement) {
    let element = {};
    element.created = pinwallElement.page.created;
    element.label = pinwallElement.page.label;
    element.pageId = pinwallElement.page.pageId;
    element.description = pinwallElement.page.description;
    element.text = pinwallElement.page.text;
    element.title = pinwallElement.page.title;
    element.topic = pinwallElement.page.topic;
    element.userRecommendationId = pinwallElement.userRecommendationId;
    element.recommendedByUser = false;
    element.isAdmin = true;
    if (element.userRecommendationId) {
        element.recommendedByUser = true;
    }
    element.totalNumberOfRecommendations = pinwallElement.totalNumberOfRecommendations;
    addLabelElement(element, pinwallElement);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
