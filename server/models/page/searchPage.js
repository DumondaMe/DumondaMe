'use strict';

var db = require('./../../neo4j');
var underscore = require('underscore');
var pagePreview = require('./pagePreview');
var pageFilter = require('./pageFilter');

var searchPageQuery = function (userId, search, filterType) {
    var filterQuery = pageFilter.getFilterQuery(filterType);

    return db.cypher().match("(page)")
        .where("(" + filterQuery + ") AND (page.title =~ {search} OR page.link =~ {search})")
        .with("page")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with("page, count(rec) AS numberOfRatings, AVG(rec.rating) AS rating");
};

var fullSearchPageQuery = function (userId, search, filterType, skip, limit) {
    var searchRegEx = '(?i).*'.concat(search, '.*');
    
    return searchPageQuery(userId, search, filterType)
        .return("page.pageId AS pageId, page.title AS title, page.label AS label, page.link AS link, numberOfRatings, rating, " +
            "EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy("page.modified DESC")
        .skip("{skip}")
        .limit("{limit}").end({
            userId: userId,
            skip: skip,
            limit: limit,
            search: searchRegEx
        });
};

var searchPage = function (userId, search, filterType, skip, limit) {

    var orderBy = "page.modified DESC",
        startQuery = searchPageQuery(userId, search, filterType),
        searchRegEx = '(?i).*'.concat(search, '.*');

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

    startQuery.match("(page:Page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user:User {userId: {userId}})")
        .where("page.title =~ {search} ")
        .with("page, user, count(rec) AS numberOfRatings, rec");

    commands.push(db.cypher().addCommand(startQuery.getCommandString())
        .return("count(*) AS totalNumberOfPages").end(params).getCommand());

    return startQuery
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, page.label AS label, " +
        "page.link AS link, numberOfRatings, rec.rating AS rating, rec.comment AS comment, user.name AS name, user.userId AS userId, " +
        "EXISTS((page)<-[:IS_ADMIN]-(user)) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end(params)
        .send(commands)
        .then(function (resp) {
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

    return db.cypher().match("(page:Page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(user:User {userId: {userId}})")
        .where("page.title =~ {search} ")
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
    searchPageQuery: fullSearchPageQuery,
    searchUserRecommendedPage: searchUserRecommendedPage,
    searchSuggestionUserRecommendedPage: searchSuggestionUserRecommendedPage
};
