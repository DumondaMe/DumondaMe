'use strict';

var db = require('./../../neo4j');
var moment = require('moment');
var uuid = require('./../../lib/uuid');

var createAction = function (userId, problemId, title, description, type) {

    var timeCreatedProblem = Math.floor(moment.utc().valueOf() / 1000),
        actionId = uuid.generateUUID();
    return db.cypher().match("(u:User {userId: {userId}}), (problem:Problem {problemId: {problemId}})")
        .createUnique("(u)-[:IS_ADMIN]->(action:Action {actionId: {actionId}, title: {title}, description: {description}, type: {type}, " +
            "created: {timeCreatedProblem}})-[:BELONGS]->(problem)")
        .return("action.actionId AS actionId")
        .end({
            userId: userId,
            title: title,
            description: description,
            type: type,
            timeCreatedProblem: timeCreatedProblem,
            problemId: problemId,
            actionId: actionId
        })
        .send().then(function (resp) {
            if (resp.length === 1) {
                return {actionId: resp[0].actionId};
            }
            return null;
        });
};

var getAction = function (userId, problemId, limit, skip) {

    return db.cypher().match("(problem:Problem {problemId: {problemId}})<-[:BELONGS]-(action:Action)")
        .optionalMatch("(action)<-[implements:IMPLEMENTS]-(user:User)")
        .return("action.actionId AS actionId, action.title AS title, action.description AS description, action.type AS type, " +
            "COUNT(implements) AS numberOfImplementations, " +
            "EXISTS((:User {userId: {userId}})-[:IMPLEMENTS]->(action)) AS implementedByUser, " +
            "EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(action)) AS isAdmin")
        .orderBy("numberOfImplementations DESC")
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
    createAction: createAction,
    getAction: getAction
};
