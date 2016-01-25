'use strict';

var db = require('./../../../neo4j');
var _ = require('underscore');
var rating = require('./ratingReason');
var create = require('./createReason');
var pageReference = require('./pageReference');

var getReasons = function (userId, problemId, limit, skip) {

    return db.cypher().match("(problem:Problem {problemId: {problemId}})<-[:BELONGS]-(reason:Reason)")
        .optionalMatch("(reason)<-[ratings:POSITIVE_RATING]-(user:User)")
        .return("reason.reasonId AS reasonId, reason.title AS title, reason.description AS description, reason.created AS created, " +
            "COUNT(ratings) AS numberOfRatings, " +
            "EXISTS((:User {userId: {userId}})-[:POSITIVE_RATING]->(reason)) AS ratedByUser, " +
            "EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(reason)) AS isAdmin")
        .orderBy("numberOfRatings DESC, created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            problemId: problemId,
            userId: userId,
            skip: skip,
            limit: limit
        }).send().then(function (resp) {
            if (_.isObject(resp)) {
                return {reasons: resp};
            }
        });
};


module.exports = {
    createReason: create.createReason,
    positiveRateReason: rating.positiveRateReason,
    removeRatingReason: rating.removeRatingReason,
    addPage: pageReference.addPage,
    getReasons: getReasons
};
