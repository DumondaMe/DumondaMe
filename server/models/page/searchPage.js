'use strict';

var db = require('./../../neo4j');
var underscore = require('underscore');
var pagePreview = require('./pagePreview');
var pageFilter = require('./pageFilter');
var cdn = require('../util/cdn');

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

var searchUserRecommendedPage = function (userId, search, skip, limit) {

    var orderBy = "page.title, page.modified DESC",
        startQuery = db.cypher(),
        searchRegEx = '(?i).*'.concat(search, '.*'),
        commands = [],
        params = {
            userId: userId,
            skip: skip,
            limit: limit,
            search: searchRegEx
        };

    startQuery.match("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user:User {userId: {userId}})")
        .where("(" + pageFilter.getFilterQuery() + ") AND page.title =~ {search} ")
        .with("page, user, count(rec) AS numberOfRatings, rec");

    commands.push(db.cypher().addCommand(startQuery.getCommandString())
        .return("count(*) AS totalNumberOfPages").end(params).getCommand());

    return startQuery
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.subCategory AS subCategory, " +
        "page.link AS link, numberOfRatings, rec.rating AS rating, rec.comment AS comment, user.name AS name, user.userId AS userId, " +
        "EXISTS((page)<-[:IS_ADMIN]-(user)) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end(params)
        .send(commands)
        .then(function (resp) {
            pagePreview.addLabel(resp[1]);
            underscore.forEach(resp[1], function (page) {
                page.imageVisible = true;
                page.profileVisible = true;
            });
            pagePreview.addContactRecommendation(resp[1]);
            pagePreview.addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

var searchSuggestionUserRecommendedPage = function (userId, search, skip, limit) {

    var searchRegEx = '(?i).*'.concat(search, '.*');

    return db.cypher().match("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user:User {userId: {userId}})")
        .where("(" + pageFilter.getFilterQuery() + ") AND page.title =~ {search} ")
        .return("DISTINCT page.title AS name")
        .orderBy("page.title")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            userId: userId,
            skip: skip,
            limit: limit,
            search: searchRegEx
        })
        .send();
};

module.exports = {
    searchPage: searchPage,
    searchUserRecommendedPage: searchUserRecommendedPage,
    searchSuggestionUserRecommendedPage: searchSuggestionUserRecommendedPage
};
