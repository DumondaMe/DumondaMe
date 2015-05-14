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
                all: {
                    numberOfRatings: preview.allNumberOfRatings,
                    rating: preview.allRating
                },
                contact: {
                    numberOfRatings: preview.contactNumberOfRatings,
                    rating: preview.contactRating
                }
            },
        };

        delete preview.allNumberOfRatings;
        delete preview.allRating;
        delete preview.contactNumberOfRatings;
        delete preview.contactRating;
    });
};

var pageOverviewQuery = function (params, orderBy, startWith, startQuery, modifiedReturn) {

    return startQuery
        //Calculating the recommendation summary statistic
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with(startWith + ", count(rec) AS allNumberOfRatings, AVG(rec.rating) AS allRating")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .with(startWith + ", allNumberOfRatings, allRating, count(rec) AS contactNumberOfRatings, AVG(rec.rating) AS contactRating")
        .return("page.pageId AS pageId, page.description AS description, page.title AS title, LABELS(page) AS types, " + modifiedReturn +
        "page.language AS language, allNumberOfRatings, allRating, contactNumberOfRatings, contactRating, " +
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
        .with("page");

    return pageOverviewQuery({
        userId: userId,
        skip: 0,
        limit: 20,
        search: searchRegEx
    }, orderBy, "page", startQuery, "page.modified AS lastModified,");
};

var getRecommendationContacts = function (userId, skip, limit, filters) {

    var orderBy = "contactRec.created DESC",
        startQuery = db.cypher(),
        filterQuery = getFilterQuery(filters),
        withCommand = "page, contactRec";

    startQuery.match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(contact:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")")
        .with("page, max(contactRec.created) AS created")
        .match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(contact:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("contactRec.created = created")
        .with(withCommand);

    return pageOverviewQuery({
        userId: userId,
        skip: skip,
        limit: limit
    }, orderBy, withCommand, startQuery, "contactRec.created AS lastModified,");
};

module.exports = {
    getRecommendationContacts: getRecommendationContacts,
    searchPage: searchPage
};
