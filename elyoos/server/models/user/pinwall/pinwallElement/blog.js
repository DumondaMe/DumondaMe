'use strict';

let profileUrl = require('./profileUrl');
let cdn = require('elyoos-server-lib').cdn;

let addBlogUrl = function (blog, heightPreviewImage) {
    if (heightPreviewImage) {
        blog.heightPreviewImage = heightPreviewImage;
        blog.previewUrl = cdn.getUrl('blog/' + blog.pageId + '/preview.jpg');
    }
};

let getPinwallElement = function (pinwallElement) {

    let element = {};
    element.pinwallType = 'Blog';
    element.label = 'Blog';
    element.pageId = pinwallElement.page.pageId;
    element.title = pinwallElement.page.title;
    element.text = pinwallElement.page.text;
    element.created = pinwallElement.created || pinwallElement.page.created;
    element.isAdmin = pinwallElement.isAdmin;
    element.isPublic = pinwallElement.isPublic;
    element.userRecommendationId = pinwallElement.userRecommendationId || pinwallElement.userBlogRecommendationId;
    element.recommendedByUser = false;
    if(element.userRecommendationId) {
        element.recommendedByUser = true;
    }
    element.totalNumberOfRecommendations = pinwallElement.totalNumberOfRecommendations;
    element.numberOfContactRecommendations = pinwallElement.numberOfContactRecommendations;
    element.topic = pinwallElement.page.topic;
    profileUrl.addProfileUrl(element, pinwallElement, 'writer');
    addBlogUrl(element, pinwallElement.page.heightPreviewImage);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
