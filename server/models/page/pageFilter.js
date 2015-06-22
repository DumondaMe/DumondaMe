'use strict';

var underscore = require('underscore');

var getFilterQuery = function (filters) {
    var filterQuery = '';
    if (filters) {
        underscore.forEach(filters, function (filter) {
            filterQuery += 'page:' + filter + ' OR ';
        });

        filterQuery = filterQuery.substring(0, filterQuery.length - 3);
    } else {
        filterQuery = "page:BookPage OR page:VideoPage OR page:SchoolPage OR page:CoursePage OR page:PracticePage OR " +
            "page:EventPage OR page:BlogPage OR page:StorePage";
    }
    return filterQuery;
};

module.exports = {
    getFilterQuery: getFilterQuery
};
