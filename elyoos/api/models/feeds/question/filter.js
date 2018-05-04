'use strict';

const getTypeFilter = function (filter) {
    if(filter === 'question') {
        return `feedElement:Question`;
    } else if(filter === 'answer') {
        return `feedElement:Answer`;
    } else {
        return `(feedElement:Question OR feedElement:Answer)`;
    }
};

module.exports = {
    getTypeFilter
};
