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

let getPageTypeFilter = function (pageType, elementName) {
    if (pageType) {
        return `(ANY(l IN LABELS(${elementName}) WHERE l IN {pageType}) OR 
                 ANY(r IN {pageType} WHERE r = ${elementName}.label))`;
    }
    return null;
};

let getFilters = function (params, elementName) {
    return db.concatCommandsWithAnd([getLanguageFilter(params.language, elementName),
         getTopicFilter(params.topic, elementName),
        getPageTypeFilter(params.pageType, elementName)]) || 'true';

};

module.exports = {
    getFilters: getFilters
};
