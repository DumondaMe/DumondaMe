'use strict';

var profileUrl = require('./profileUrl');
var pagePreview = require('./../../../page/pagePreview');

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
    element.link = pinwallElement.pinwallData.link;
    element.isAdmin = pinwallElement.isAdmin;
    profileUrl.addProfileUrl(element, pinwallElement);
    pagePreview.addPageUrl([element]);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
