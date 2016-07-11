'use strict';

var cdn = require('../../util/cdn');

var addBlogUrl = function (blog, heightPreviewImage) {
    if (heightPreviewImage) {
        blog.url = cdn.getUrl('blog/' + blog.blogId + '/preview.jpg');
    }
};

var getRecommendationElement = function (pinwallElement) {

    var element = {};
    element.label = 'Blog';
    element.blogId = pinwallElement.recommendationElement.blogId;
    element.title = pinwallElement.recommendationElement.title;
    element.numberOfRecommendations = pinwallElement.numberOfRecommendations;
    element.topic = pinwallElement.recommendationElement.topic;
    element.url = cdn.getUrl(`profileImage/${pinwallElement.writer.userId}/thumbnail.jpg`);
    return element;
};


module.exports = {
    getRecommendationElement: getRecommendationElement
};
