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

var getOtherUserRecommendation = function (pageId, pageLabel, userId, limit, skip) {

    return db.cypher().match("(" + pageLabel + " {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(u:User)")
        .where("u.userId <> {userId}")
        .return("rec.recommendationId AS recommendationId, rec.comment AS comment, rec.rating AS rating, u.userId AS userId, u.name AS name")
        .orderBy("rec.created")
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
    addProfileThumbnail: addProfileThumbnail,
    addProfileThumbnails: addProfileThumbnails
};
