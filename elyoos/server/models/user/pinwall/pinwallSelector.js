'use strict';

let _ = require('underscore');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let compareCreated = function (a, b) {
    return b.created - a.created;
};

let comparePopular = function (a, b) {
    if(b.totalNumberOfRecommendations === a.totalNumberOfRecommendations) {
        return b.created - a.created;
    } else {
        return b.totalNumberOfRecommendations - a.totalNumberOfRecommendations;
    }
};

let comparePopularOnlyContacts = function (a, b) {
    if(b.numberOfContactRecommendations === a.numberOfContactRecommendations) {
        return b.created - a.created;
    } else {
        return b.numberOfContactRecommendations - a.numberOfContactRecommendations;
    }
};

let sortPinwall = function (blogs, recommendations, skipRecommendation, skipBlog, limit, order, onlyContacts) {
    let result = {
        pinwall: [],
        skipBlog: skipBlog,
        skipRecommendation: skipRecommendation
    };
    result.pinwall = result.pinwall.concat(recommendations, blogs);

    if (order === 'popular') {
        if(onlyContacts) {
            result.pinwall.sort(comparePopularOnlyContacts);
        } else {
            result.pinwall.sort(comparePopular);
        }
    } else {
        result.pinwall.sort(compareCreated);
    }
    result.pinwall = result.pinwall.slice(0, limit);

    _.each(result.pinwall, function (pinwallElement) {

        if (_.contains(pinwallElement.pinwallType, 'Blog')) {
            result.skipBlog++;
        } else if (_.contains(pinwallElement.pinwallType, 'Page')) {
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
