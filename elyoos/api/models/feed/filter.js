'use strict';

const getTypeFilter = function (filter) {
    if (filter === 'commitment') {
        return `feedElement:Commitment`;
    }
    return `feedElement:Question`;
};

module.exports = {
    getTypeFilter
};
