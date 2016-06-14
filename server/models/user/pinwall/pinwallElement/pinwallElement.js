'use strict';

var blog = require('./blog');
var recommendation = require('./recommendation');
var recommendationBlog = require('./recommendationBlog');
var _ = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getPinwallElements = function (pinwallElements) {
    var result = [];
    _.each(pinwallElements, function (pinwallElement) {
        var element;
        if (_.contains(pinwallElement.pinwallType, 'Blog')) {
            element = blog.getPinwallElement(pinwallElement);
        } else if (_.contains(pinwallElement.pinwallType, 'Recommendation') && !pinwallElement.writer) {
            element = recommendation.getPinwallElement(pinwallElement);
        } else if (_.contains(pinwallElement.pinwallType, 'Recommendation') && pinwallElement.writer) {
            element = recommendationBlog.getPinwallElement(pinwallElement);
        }
        else {
            logger.error("Unknown Pinwall Element " + pinwallElement.pinwallType);
        }
        result.push(element);
    });
    return result;
};


module.exports = {
    getPinwallElements: getPinwallElements
};
