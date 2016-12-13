'use strict';

var blog = require('./blog');
var book = require('./book');
var link = require('./link');
var place = require('./place');
var youtube = require('./youtube');
var _ = require('underscore');
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var getRecommendationElements = function (recommendationElements) {
    var result = [];
    _.each(recommendationElements, function (recommendationElement) {
        var element;
        if (_.contains(recommendationElement.pinwallType, 'Blog')) {
            element = blog.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Book') {
            element = book.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Youtube') {
            element = youtube.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Link') {
            element = link.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Place') {
            element = place.getRecommendationElement(recommendationElement);
        }else {
            logger.error(`Unknown Recommendation Element ${recommendationElement.pinwallType}`);
        }
        result.push(element);
    });
    return result;
};


module.exports = {
    getRecommendationElements: getRecommendationElements
};
