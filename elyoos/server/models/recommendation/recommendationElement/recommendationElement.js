'use strict';

let blog = require('./blog');
let book = require('./book');
let link = require('./link');
let generic = require('./generic');
let youtube = require('./youtube');
let _ = require('underscore');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getRecommendationElements = function (recommendationElements) {
    let result = [];
    _.each(recommendationElements, function (recommendationElement) {
        let element;
        if (_.contains(recommendationElement.pinwallType, 'Blog')) {
            element = blog.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Book') {
            element = book.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Youtube') {
            element = youtube.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Link') {
            element = link.getRecommendationElement(recommendationElement);
        } else if (_.contains(recommendationElement.pinwallType, 'Page') && recommendationElement.recommendationElement.label === 'Generic') {
            element = generic.getRecommendationElement(recommendationElement);
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
