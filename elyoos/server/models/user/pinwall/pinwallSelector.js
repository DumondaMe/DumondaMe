'use strict';

let _ = require('underscore');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let compare = function (a, b) {
    return b.pinwall.created - a.pinwall.created;
};

let sortPinwall = function (blogs, recommendations, skipRecommendation, skipBlog, limit) {
    let result = {
        pinwall: [],
        skipBlog: skipBlog,
        skipRecommendation: skipRecommendation
    };

    if (blogs) {
        result.pinwall = result.pinwall.concat(recommendations, blogs);

        result.pinwall.sort(compare);

        result.pinwall = result.pinwall.slice(0, limit);
    } else {
        result.pinwall = recommendations;
    }

    _.each(result.pinwall, function (pinwallElement) {

        if (_.contains(pinwallElement.pinwallType, 'Blog')) {
            result.skipBlog++;
        } else if (_.contains(pinwallElement.pinwallType, 'Recommendation')) {
            result.skipRecommendation++;
        } else {
            logger.error("Unknown Pinwall Element " + pinwallElement.pinwallType);
        }
    });
    return result;
};


module.exports = {
    sortPinwall: sortPinwall
};
