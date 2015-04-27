'use strict';

var db = require('./../../../neo4j');
var underscore = require('underscore');
var cdn = require('../../util/cdn');
var logger = requireLogger.getLogger(__filename);

var getUserRecommendation = function (pageId, pageLabel, userId) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(u:User {userId: {userId}})")
        .return("rec.recommendationId AS recommendationId, rec.comment AS comment, rec.rating AS rating")
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

var getRecommendationSummaryAll = function (pageId, pageLabel) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .return("count(*) AS numberOfRatings, AVG(rec.rating) AS rating")
        .end({pageId: pageId});
};

var getRecommendationSummaryContacts = function (pageId, pageLabel, userId) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)" +
        "<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .return("count(*) AS numberOfRatings, AVG(rec.rating) AS rating")
        .end({pageId: pageId, userId: userId});
};

var getOtherUserRecommendation = function (pageId, pageLabel, userId, limit, skip) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(u:User)")
        .where("u.userId <> {userId}")
        .return("rec.recommendationId AS recommendationId, rec.comment AS comment, rec.rating AS rating, u.userId AS userId, u.name AS name")
        .orderBy("rec.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({pageId: pageId, userId: userId, limit: limit, skip: skip})
        .getCommand();
};

var addProfileThumbnail = function (recommendation, userId) {
    recommendation.profileUrl = cdn.getUrl('profileImage/' + userId + '/thumbnail.jpg');
};

var addProfileThumbnails = function (recommendations) {
    underscore.forEach(recommendations, function (recommendation) {
        recommendation.profileUrl = cdn.getUrl('profileImage/' + recommendation.userId + '/thumbnail.jpg');
    });
};

module.exports = {
    getUserRecommendation: getUserRecommendation,
    getOtherUserRecommendation: getOtherUserRecommendation,
    getRecommendationSummaryAll: getRecommendationSummaryAll,
    getRecommendationSummaryContacts: getRecommendationSummaryContacts,
    addProfileThumbnail: addProfileThumbnail,
    addProfileThumbnails: addProfileThumbnails
};
