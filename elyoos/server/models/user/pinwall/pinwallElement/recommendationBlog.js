'use strict';

var profileUrl = require('./profileUrl');
var cdn = require('../../../util/cdn');
var numberOfRecommendation = require('./numberOfRecommendation');

var addUrl = function (element) {
    if (element.heightPreviewImage) {
        element.url = cdn.getUrl(`blog/${element.pageId}/preview.jpg`);
        element.urlFull = cdn.getUrl(`blog/${element.pageId}/normal.jpg`);
    }
};

var getPinwallElement = function (pinwallElement) {
    var element = {};
    element.pinwallType = 'Recommendation';
    element.label = 'Blog';
    element.writerName = pinwallElement.writer.name;
    element.writerUserId = pinwallElement.writer.userId;
    element.created = pinwallElement.pinwall.created;
    element.pageId = pinwallElement.pinwallData.pageId;
    element.text = pinwallElement.pinwallData.text;
    element.heightPreviewImage = pinwallElement.pinwallData.heightPreviewImage;
    element.isAdmin = pinwallElement.writer.userId === pinwallElement.user.userId;

    element.title = pinwallElement.pinwallData.title;
    element.topic = pinwallElement.pinwallData.topic;
    element.numberOfRecommendations = numberOfRecommendation.getNumberOfRecommendation(pinwallElement);
    element.thisRecommendationByUser = pinwallElement.thisRecommendationByUser;
    element.userRecommendationId = pinwallElement.userRecommendationId;
    element.recommendedByUser = false;
    if (element.userRecommendationId) {
        element.recommendedByUser = true;
    }
    profileUrl.addProfileUrl(element, pinwallElement);
    addUrl(element, pinwallElement);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
