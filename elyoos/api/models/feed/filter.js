'use strict';

const getTypeFilter = function (filter, language) {
    let result = `feedElement.language = '${language}' AND`;
    if (filter === 'commitment') {
        return `${result} feedElement:Commitment`;
    } else if (filter === 'event') {
        return `${result} feedElement:Event`;
    }
    return `${result} feedElement:Question`;
};

module.exports = {
    getTypeFilter
};
