'use strict';

var cdn = require('../../util/cdn');

var addBlogUrl = function (blog, heightPreviewImage) {
    if (heightPreviewImage) {
        blog.heightPreviewImage = heightPreviewImage;
        blog.url = cdn.getUrl('blog/' + blog.blogId + '/preview.jpg');
    }
};

var getRecommendationElement = function (pinwallElement) {

    var element = {};
    element.label = 'Blog';
    element.blogId = pinwallElement.recommendationElement.blogId;
    element.title = pinwallElement.recommendationElement.title;
    element.text = pinwallElement.recommendationElement.text;
    element.created = pinwallElement.recommendationElement.created;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.language = pinwallElement.recommendationElement.language;
    element.topic = pinwallElement.recommendationElement.topic;
    addBlogUrl(element, pinwallElement.recommendationElement.pictureHeight);
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
