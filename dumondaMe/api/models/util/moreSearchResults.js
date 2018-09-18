'use strict';

const getHasMoreResults = function (results, pageSize) {
    if (results.length > pageSize) {
        results.pop();
        return true;
    }
    return false;
};

module.exports = {
    getHasMoreResults
};
