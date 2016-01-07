'use strict';

var db = require('./../../neo4j');
var moment = require('moment');
var uuid = require('./../../lib/uuid');

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

var getReasons = function (userId, problemId, limit, skip) {

    return db.cypher().match("(problem:Problem {problemId: {problemId}})<-[:BELONGS]-(reason:Reason)")
        .optionalMatch("(reason)<-[ratings:POSITIVE_RATING]-(user:User)")
        .return("reason.reasonId AS reasonId, reason.title AS title, reason.description AS description, " +
            "COUNT(ratings) AS numberOfRatings, " +
            "EXISTS((:User {userId: {userId}})-[:POSITIVE_RATING]->(reason)) AS ratedByUser, " +
            "EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(reason)) AS isAdmin")
        .orderBy("numberOfRatings DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            problemId: problemId,
            userId: userId,
            skip: skip,
            limit: limit
        })
        .send();
};


module.exports = {
    createReason: createReason,
    getReasons: getReasons
};
