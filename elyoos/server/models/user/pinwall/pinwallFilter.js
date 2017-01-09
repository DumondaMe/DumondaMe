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

let getRecommendationFilters = function (params, elementName) {
    return db.concatCommandsWithAnd([getLanguageFilter(params.language, elementName),
         getTopicFilter(params.topic, elementName), getRecommendationTypeFilter(params.recommendationType, elementName)]);
};

let getBlogFilters = function (params, elementName) {
    return db.concatCommandsWithAnd([getLanguageFilter(params.language, elementName), getTopicFilter(params.topic, elementName)]);
};

module.exports = {
    getRecommendationFilters: getRecommendationFilters,
    getBlogFilters: getBlogFilters
};
