'use strict';

var profileUrl = require('./profileUrl');
var cdn = require('../../../util/cdn');
var numberOfRecommendation = require('./numberOfRecommendation');

var addBlogUrl = function (blog, heightPreviewImage) {
    if (heightPreviewImage) {
        blog.heightPreviewImage = heightPreviewImage;
        blog.url = cdn.getUrl('blog/' + blog.blogId + '/preview.jpg');
    }
};

var getPinwallElement = function (pinwallElement) {

    var element = {};
    element.pinwallType = 'Blog';
    element.blogId = pinwallElement.pinwall.blogId;
    element.title = pinwallElement.pinwall.title;
    element.text = pinwallElement.pinwall.text;
    element.created = pinwallElement.pinwall.created;
    element.isAdmin = pinwallElement.isAdmin;
    element.isPublic = pinwallElement.isPublic;
    element.numberOfRecommendations = numberOfRecommendation.getNumberOfRecommendation(pinwallElement);
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
