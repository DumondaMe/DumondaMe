'use strict';

let db = requireDb();

let getLanguageFilter = function (language, elementName) {
    if (language) {
        return `ANY(l IN ${elementName}.language WHERE l IN {language})`;
    }
    return null;
};

let getTopicFilter = function (topic, elementName) {
    if (topic) {
        return `ANY(l IN ${elementName}.topic WHERE l IN {topic})`;
    }
    return null;
};

let getRecommendationTypeFilter = function (recommendationType, elementName) {
    if (recommendationType) {
        return `(ANY(l IN LABELS(${elementName}) WHERE l IN {recommendationType}) OR 
                 ANY(r IN {recommendationType} WHERE r = ${elementName}.label))`;
    }
    return null;
};

let getOnlyOtherUsers = function (isPopular) {
    if(!isPopular) {
        return "NOT user.userId = contact.userId";
    }
    return null;
};

let getFilters = function (params, elementName, isPopular) {
    return db.concatCommandsWithAnd([getLanguageFilter(params.language, elementName),
         getTopicFilter(params.topic, elementName),
        getRecommendationTypeFilter(params.recommendationType, elementName),
        getOnlyOtherUsers(isPopular)]);
};

module.exports = {
    getFilters: getFilters
};
