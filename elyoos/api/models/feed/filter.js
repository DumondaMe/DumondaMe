'use strict';

const getTypeFilter = function (filter) {
    if(filter === 'question') {
        return `feedElement:Question`;
    } else if(filter === 'commitment') {
        return `feedElement:Commitment`;
    } else {
        return `(feedElement:Question OR feedElement:Commitment)`;
    }
};

module.exports = {
    getTypeFilter
};
