'use strict';

const getTypeFilter = function (filter, language) {
    if (filter === 'commitment') {
        return `feedElement.language = '${language}' AND feedElement:Commitment`;
    } else if (filter === 'event') {
        return `creator.language = '${language}' AND feedElement:Event AND feedElement.endDate > {timestamp}`;
    }
    return `feedElement.language = '${language}' AND feedElement:Question`;
};

module.exports = {
    getTypeFilter
};
