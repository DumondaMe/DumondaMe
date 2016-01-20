'use strict';

var db = require('./../../neo4j');
var moment = require('moment');
var uuid = require('./../../lib/uuid');
var _ = require('underscore');
var check = require('./check/reason');

var createReason = function (userId, problemId, title, description) {

    var timeCreatedProblem = Math.floor(moment.utc().valueOf() / 1000),
        reasonId = uuid.generateUUID();
    return db.cypher().match("(u:User {userId: {userId}}), (problem:Problem {problemId: {problemId}})")
        .createUnique("(u)-[:IS_ADMIN]->(reason:Reason {reasonId: {reasonId}, title: {title}, description: {description}, " +
            "created: {timeCreatedProblem}})-[:BELONGS]->(problem)")
        .return("reason.reasonId AS reasonId")
        .end({
            userId: userId,
            title: title,
            description: description,
            timeCreatedProblem: timeCreatedProblem,
            problemId: problemId,
            reasonId: reasonId
        })
        .send().then(function (resp) {
            if (resp.length === 1) {
                return {reasonId: resp[0].reasonId};
            }
            return null;
        });
};

var countRatingReason = function () {
    return db.cypher().match("(:User)-[:POSITIVE_RATING]->(:Reason)")
        .return("count(*) AS numberOfRatings").end();

};

var positiveRateReasonCommand = function (userId, reasonId) {
    var created = Math.floor(moment.utc().valueOf() / 1000);
    return db.cypher().match("(u:User {userId: {userId}}), (reason:Reason {reasonId: {reasonId}})")
        .createUnique("(u)-[rating:POSITIVE_RATING {created: {created}}]->(reason)")
        .return("rating.created AS created")
        .end({
            userId: userId,
            reasonId: reasonId,
            created: created
        }).getCommand();
};

var positiveRateReason = function (userId, reasonId, req) {

    return check.checkAllowedPositiveRateReason(userId, reasonId, req).then(function () {
        return countRatingReason().send([positiveRateReasonCommand(userId, reasonId)]).then(function (resp) {
                if (resp[0][0].hasOwnProperty("created")) {
                    return {created: resp[0][0].created, numberOfRatings: resp[1][0].numberOfRatings};
                }
                return null;
            });
    });
};

var removeRatingReasonCommand = function (userId, reasonId) {
    return db.cypher().match("(u:User {userId: {userId}})-[rating:POSITIVE_RATING]->(reason:Reason {reasonId: {reasonId}})")
        .delete("rating")
        .end({
            userId: userId,
            reasonId: reasonId
        }).getCommand();
};

var removeRatingReason = function (userId, reasonId, req) {

    return check.checkAllowedRemoveRating(userId, reasonId, req).then(function () {
        return countRatingReason().send([removeRatingReasonCommand(userId, reasonId)]).then(function (resp) {
            return {numberOfRatings: resp[1][0].numberOfRatings};
        });
    });
};

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
    createReason: createReason,
    positiveRateReason: positiveRateReason,
    removeRatingReason: removeRatingReason,
    getReasons: getReasons
};
