'use strict';

let db = requireDb();
let underscore = require('underscore');
let cdn = require('../../util/cdn');

let getRecommendationSummaryAll = function (pageId) {

    return db.cypher().match("(:Page {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)")
        .return("count(*) AS numberOfRecommendations")
        .end({pageId: pageId});
};

let getRecommendationSummaryContacts = function (pageId, userId) {

    return db.cypher().match("(:Page {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)" +
        "<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .return("count(*) AS numberOfRecommendations")
        .end({pageId: pageId, userId: userId});
};

let getUserRecommendation = function (pageId, userId) {

    return db.cypher().match("(:Page {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(u:User {userId: {userId}})")
        .return("rec.recommendationId AS recommendationId, rec.comment AS comment, rec.created AS created")
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

let getOtherUserRecommendation = function (pageId, userId, limit, skip) {

    return db.cypher().match("(:Page {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(u:User)")
        .where("u.userId <> {userId}")
        .return("rec.recommendationId AS recommendationId, rec.comment AS comment, u.userId AS userId, u.name AS name")
        .orderBy("rec.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({pageId: pageId, userId: userId, limit: limit, skip: skip})
        .getCommand();
};

let addProfileThumbnail = function (recommendation, userId) {
    recommendation.profileUrl = cdn.getUrl('profileImage/' + userId + '/thumbnail.jpg');
};

let addProfileThumbnails = function (recommendations) {
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
