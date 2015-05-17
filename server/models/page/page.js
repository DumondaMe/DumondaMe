'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var underscore = require('underscore');
var cdn = require('../util/cdn');
var logger = requireLogger.getLogger(__filename);

var addImageUrl = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.url = cdn.getUrl('pages/' + preview.label + '/' + preview.pageId + '/pagePreview.jpg');
    });
};

var addLabel = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.label = preview.types[0];
        delete preview.types;
    });
};

var addRecommendation = function (previews) {
    underscore.forEach(previews, function (preview) {

        preview.recommendation = {
            summary: {
                numberOfRatings: preview.numberOfRatings,
                rating: preview.rating
            }
        };

        delete preview.numberOfRatings;
        delete preview.rating;
    });
};

var pagePreviewQuery = function (params, orderBy, startQuery) {

    return startQuery
        .return("page.pageId AS pageId, page.title AS title, LABELS(page) AS types, page.language AS language, " +
        "numberOfRatings, rating, " +
        "EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end(params)
        .send()
        .then(function (resp) {
            addLabel(resp);
            addRecommendation(resp);
            addImageUrl(resp);
            return {pages: resp};
        });
};

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

var searchPage = function (userId, search, filterType, filterLanguage, isSuggestion) {

    var orderBy = "page.modified DESC",
        startQuery = db.cypher(),
        searchRegEx = '(?i).*'.concat(search, '.*'),
        filterQuery = getFilterQuery(filterType),
        filterLanguageQuery = '';

    if (filterLanguage) {
        filterLanguageQuery = "AND page.language = '" + filterLanguage + "'";
    }

    startQuery.match("(page)")
        .where("(" + filterQuery + ") AND page.title =~ {search} " + filterLanguageQuery)
        .with("page")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with("page, count(rec) AS numberOfRatings, AVG(rec.rating) AS rating");

    return pagePreviewQuery({
        userId: userId,
        skip: 0,
        limit: 20,
        search: searchRegEx
    }, orderBy, startQuery);
};

var getRecommendationContacts = function (userId, skip, limit, filters) {

    var orderBy = "contactRec.created DESC",
        startQuery = db.cypher(),
        filterQuery = getFilterQuery(filters);

    startQuery.match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, max(contactRec.created) AS created")
        .match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(contact:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("contactRec.created = created")
        .with("page, contactRec")
        .match("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .with("page, contactRec, count(rec) AS numberOfRatings, AVG(rec.rating) AS rating");

    return pagePreviewQuery({
        userId: userId,
        skip: skip,
        limit: limit
    }, orderBy, startQuery);
};

var getPopularPages = function (userId, skip, limit, onlyContact, pageType) {

    var orderBy = "rating DESC, numberOfRatings DESC",
        startQuery = db.cypher();

        startQuery.match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("page:" + pageType)
        .with("page, AVG(contactRec.rating) AS rating, COUNT(contactRec) AS numberOfRatings");

    return pagePreviewQuery({
        userId: userId,
        skip: skip,
        limit: limit
    }, orderBy, startQuery);
};

module.exports = {
    getRecommendationContacts: getRecommendationContacts,
    getPopularPages: getPopularPages,
    searchPage: searchPage
};
