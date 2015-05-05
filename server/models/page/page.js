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
            }
        };

        delete preview.allNumberOfRatings;
        delete preview.allRating;
        delete preview.contactNumberOfRatings;
        delete preview.contactRating;

        delete preview.userRecComment;
        delete preview.userRecRecommendationId;
        delete preview.userRecRating;
    });
};

var getAllPages = function (userId, skip, limit, isSuggestion) {

    var commands = [];

    return db.cypher().match("(page)")
        .where("page:BookPage OR page:VideoPage OR page:SchoolPage OR page:CoursePage OR page:PracticePage OR " +
        "page:EventPage OR page:BlogPage OR page:StorePage")
        .with("page")
        .orderBy("page.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        //Calculating the recommendation summary statistic
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .with("page, count(rec) AS allNumberOfRatings, AVG(rec.rating) AS allRating")
        .orderBy("page.created DESC")
        .optionalMatch("(page)<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .with("page, allNumberOfRatings, allRating, count(rec) AS contactNumberOfRatings, AVG(rec.rating) AS contactRating")
        .orderBy("page.created DESC")
        //Get If available user recommendation
        .optionalMatch("(page)<-[:RECOMMENDS]-(userRec:Recommendation)<-[:RECOMMENDS]-(:User {userId: {userId}})")
        .with("page, allNumberOfRatings, allRating, contactNumberOfRatings, contactRating, userRec")
        .return("page.pageId AS pageId, page.description AS description, page.title AS title, LABELS(page) AS types, page.created AS lastModified, " +
        "page.language AS language, allNumberOfRatings, allRating, contactNumberOfRatings, contactRating," +
        "userRec.comment AS userRecComment, userRec.recommendationId AS userRecRecommendationId, userRec.rating AS userRecRating")
        .end({skip: skip, limit: limit, userId: userId})
        .send(commands)
        .then(function (resp) {
            addLabel(resp);
            addRecommendation(resp);
            addImageUrl(resp);
            return {pages: resp};
        });
};

module.exports = {
    getAllPages: getAllPages
};
