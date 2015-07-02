'use strict';

var underscore = require('underscore');

var getFilterQuery = function (filters) {
    var filterQuery = '';
    if (filters) {
        underscore.forEach(filters, function (filter) {
            filterQuery += "page.label = '" + filter + "' OR ";
        });

        filterQuery = filterQuery.substring(0, filterQuery.length - 3);
    } else {
        filterQuery = 'true';
    }
    return filterQuery;
};

module.exports = {
    getFilterQuery: getFilterQuery
};
