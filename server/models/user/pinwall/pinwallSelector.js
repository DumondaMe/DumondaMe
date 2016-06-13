'use strict';

var _ = require('underscore');
var logger = requireLogger.getLogger(__filename);

var compare = function (a, b) {
    return b.pinwall.created - a.pinwall.created;
};

var sortPinwall = function (blogs, recommendations, skipRecommendation, skipBlog, limit) {
    var result = {
        pinwall: [],
        skipBlog: skipBlog,
        skipRecommendation: skipRecommendation
    };

    result.pinwall = result.pinwall.concat(recommendations, blogs);

    result.pinwall.sort(compare);

    result.pinwall = result.pinwall.slice(0, limit);

    _.each(result.pinwall, function (pinwallElement) {
        
        if (pinwallElement.pinwallType === 'Blog') {
            result.skipBlog++;
        } else if (pinwallElement.pinwallType === 'Recommendation') {
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
