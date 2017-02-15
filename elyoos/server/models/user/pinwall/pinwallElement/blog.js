'use strict';

let profileUrl = require('./profileUrl');
let cdn = require('elyoos-server-lib').cdn;
let numberOfRecommendation = require('./numberOfRecommendation');

let addBlogUrl = function (blog, heightPreviewImage) {
    if (heightPreviewImage) {
        blog.heightPreviewImage = heightPreviewImage;
        blog.previewUrl = cdn.getUrl('blog/' + blog.pageId + '/preview.jpg');
    }
};

let getPinwallElement = function (pinwallElement) {

    let element = {};
    element.pinwallType = 'Blog';
    element.pageId = pinwallElement.pinwall.pageId;
    element.title = pinwallElement.pinwall.title;
    element.text = pinwallElement.pinwall.text;
    element.created = pinwallElement.pinwall.created;
    element.isAdmin = pinwallElement.isAdmin;
    element.isPublic = pinwallElement.isPublic;
    element.totalNumberOfRecommendations = numberOfRecommendation.getNumberOfRecommendation(pinwallElement);
    element.userRecommendationId = pinwallElement.userRecommendationId || pinwallElement.userBlogRecommendationId;
    element.recommendedByUser = false;
    if(element.userRecommendationId) {
        element.recommendedByUser = true;
    }
    element.topic = pinwallElement.pinwall.topic;
    profileUrl.addProfileUrl(element, pinwallElement);
    addBlogUrl(element, pinwallElement.pinwall.heightPreviewImage);
    return element;
};


module.exports = {
    getPinwallElement: getPinwallElement
};
