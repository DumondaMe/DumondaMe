'use strict';

const getTypeFilter = function (filter) {
    if (filter === 'question') {
        return `(watch:User OR watch:Question) AND (feedElement:Answer OR feedElement:Question)`;
    } else if (filter === 'commitment') {
        return `(watch:User OR watch:Commitment) AND feedElement:Commitment`;
    } else if (filter === 'event') {
        return `(watch:User OR watch:Commitment) AND feedElement:Event`;
    }
    return `(watch:User OR watch:Question OR watch:Commitment) AND 
            (feedElement:Answer OR feedElement:Commitment OR feedElement:Question)`;
};

module.exports = {
    getTypeFilter
};
