'use strict';

var profileUrl = require('./profileUrl');

var addLinkElement = function (element, pinwallElement) {
    if(element.label === 'Link') {
        element.link = pinwallElement.pinwallData.link;
        element.hostname = pinwallElement.pinwallData.hostname;
    }
};

var getPinwallElement = function (pinwallElement) {
    var element = {};
    element.pinwallType = 'Recommendation';
    element.rating = pinwallElement.pinwall.rating;
    element.comment = pinwallElement.pinwall.comment;
    element.created = pinwallElement.pinwall.created;
    element.label = pinwallElement.pinwallData.label;
    element.pageId = pinwallElement.pinwallData.pageId;
    element.description = pinwallElement.pinwallData.description;
    element.title = pinwallElement.pinwallData.title;
    element.category = pinwallElement.pinwallData.category;
    element.userHasRecommended = pinwallElement.userHasRecommended;
    element.thisRecommendationByUser = pinwallElement.thisRecommendationByUser;
    element.numberOfSamePinwallData = pinwallElement.numberOfSamePinwallData;
    profileUrl.addProfileUrl(element, pinwallElement);
    addLinkElement(element, pinwallElement);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
