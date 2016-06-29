'use strict';

var profileUrl = require('./profileUrl');
var cdn = require('../../../util/cdn');

var addLinkElement = function (element, pinwallElement) {
    if (element.label === 'Link') {
        element.link = pinwallElement.pinwallData.link;
        element.hostname = pinwallElement.pinwallData.hostname;
        element.heightPreviewImage = pinwallElement.pinwallData.heightPreviewImage;
        if (element.heightPreviewImage) {
            element.linkPreviewUrl = cdn.getUrl(`pages/${element.pageId}/preview.jpg`);
        }
    } else if (element.label === 'Book') {
        element.bookPreviewUrl = cdn.getUrl(`pages/${element.pageId}/pagePreview.jpg`);
    } else if (element.label === 'Youtube') {
        element.link = pinwallElement.pinwallData.link;
    }
};

var getPinwallElement = function (pinwallElement) {
    var element = {};
    element.pinwallType = 'Recommendation';
    element.comment = pinwallElement.pinwall.comment;
    element.created = pinwallElement.pinwall.created;
    element.label = pinwallElement.pinwallData.label;
    element.pageId = pinwallElement.pinwallData.pageId;
    element.description = pinwallElement.pinwallData.description;
    element.title = pinwallElement.pinwallData.title;
    element.topic = pinwallElement.pinwallData.topic;
    element.recommendedByUser = pinwallElement.recommendedByUser;
    element.recommendationId = pinwallElement.recommendationId;
    element.thisRecommendationByUser = pinwallElement.thisRecommendationByUser;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    profileUrl.addProfileUrl(element, pinwallElement);
    addLinkElement(element, pinwallElement);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
