'use strict';

let admin = require('./admin');
let blog = require('./blog');
let recommendation = require('./recommendation');
let recommendationBlog = require('./recommendationBlog');
let _ = require('underscore');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getPinwallElements = function (pinwallElements) {
    let result = [];
    _.each(pinwallElements, function (pinwallElement) {
        let element;
        if (pinwallElement.isAdminType === true) {
            element = admin.getPinwallElement(pinwallElement);
        } else if (_.contains(pinwallElement.pinwallType, 'Blog')) {
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
