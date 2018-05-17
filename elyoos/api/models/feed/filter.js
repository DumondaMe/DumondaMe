'use strict';

const getTypeFilter = function (filter) {
    if (filter === 'commitment') {
        return `feedElement:Commitment`;
    } else if (filter === 'event') {
        return `feedElement:Event`;
    }
    return `feedElement:Question`;
};

module.exports = {
    getTypeFilter
};
