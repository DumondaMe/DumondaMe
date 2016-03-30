'use strict';

var profileUrl = require('./profileUrl');

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
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
