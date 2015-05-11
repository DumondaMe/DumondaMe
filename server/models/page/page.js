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
            user: {
                recommendationId: preview.userRecRecommendationId,
                comment: preview.userRecComment,
                rating: preview.userRecRating
            },
            contact: {
                comment: preview.contactRecComment,
                rating: preview.contactRecRating
            }
        };

        delete preview.allNumberOfRatings;
        delete preview.allRating;
        delete preview.contactNumberOfRatings;
        delete preview.contactRating;

        delete preview.userRecComment;
        delete preview.userRecRecommendationId;
        delete preview.userRecRating;

        delete preview.contactRecComment;
        delete preview.contactRecRating;
    });
};

var pageOverviewQuery = function (params, orderBy, startQuery) {

    return startQuery
        .with("page, contactRec")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        //Calculating the recommendation summary statistic
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with("page, contactRec, count(rec) AS allNumberOfRatings, AVG(rec.rating) AS allRating")
        .orderBy(orderBy)
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .with("page, contactRec, allNumberOfRatings, allRating, count(rec) AS contactNumberOfRatings, AVG(rec.rating) AS contactRating")
        .orderBy(orderBy)
        //Get If available user recommendation
        .optionalMatch("(page)<-[:RECOMMENDS]-(userRec:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}})")
        .with("page, contactRec, allNumberOfRatings, allRating, contactNumberOfRatings, contactRating, userRec")
        .return("page.pageId AS pageId, page.description AS description, page.title AS title, LABELS(page) AS types, page.created AS lastModified, " +
        "page.language AS language, allNumberOfRatings, allRating, contactNumberOfRatings, contactRating," +
        "userRec.comment AS userRecComment, userRec.recommendationId AS userRecRecommendationId, userRec.rating AS userRecRating, " +
        "contactRec.comment AS contactRecComment, contactRec.rating AS contactRecRating")
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

    var orderBy = "page.created DESC",
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
        .optionalMatch("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})");

    return pageOverviewQuery({userId: userId, skip: 0, limit: 20, search: searchRegEx}, orderBy, startQuery);
};

var getPages = function (userId, skip, limit, filters) {

    var orderBy = "contactRec.created DESC",
        startQuery = db.cypher(),
        filterQuery = getFilterQuery(filters);

    startQuery.match("(page)<-[:RECOMMENDS]-(contactRec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .where("(" + filterQuery + ")");

    return pageOverviewQuery({userId: userId, skip: skip, limit: limit}, orderBy, startQuery);
};

module.exports = {
    getPages: getPages,
    searchPage: searchPage
};
