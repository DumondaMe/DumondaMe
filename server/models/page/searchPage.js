'use strict';

var db = require('./../../neo4j');
var pagePreview = require('./pagePreview');
var pageFilter = require('./pageFilter');

var searchPage = function (userId, search, filterType, filterLanguage, skip, limit) {

    var orderBy = "page.modified DESC",
        startQuery = db.cypher(),
        searchRegEx = '(?i).*'.concat(search, '.*'),
        filterQuery = pageFilter.getFilterQuery(filterType),
        filterLanguageQuery = '';

    if (filterLanguage) {
        filterLanguageQuery = "AND page.language = '" + filterLanguage + "'";
    }

    startQuery.match("(page)")
        .where("(" + filterQuery + ") AND page.title =~ {search} " + filterLanguageQuery)
        .with("page")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with("page, count(rec) AS numberOfRatings, AVG(rec.rating) AS rating");

    return pagePreview.pagePreviewQuery({
        userId: userId,
        skip: skip,
        limit: limit,
        search: searchRegEx
    }, orderBy, startQuery);
};

module.exports = {
    searchPage: searchPage
};
