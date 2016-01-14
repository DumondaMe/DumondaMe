'use strict';

var db = require('./../../neo4j');
var moment = require('moment');
var uuid = require('./../../lib/uuid');

var createProblem = function (userId, description) {

    var timeCreatedProblem = Math.floor(moment.utc().valueOf() / 1000),
        problemId = uuid.generateUUID();
    return db.cypher().match("(u:User {userId: {userId}})")
        .createUnique("(u)-[:IS_ADMIN]->(problem:Problem {problemId: {problemId}, description: {description}, created: {timeCreatedProblem}})")
        .return("problem.problemId AS problemId")
        .end({
            userId: userId,
            description: description,
            timeCreatedProblem: timeCreatedProblem,
            problemId: problemId
        })
        .send().then(function (resp) {
            return {problemId: resp[0].problemId};
        });
};

var getProblems = function (userId, limit, skip) {

    return db.cypher().match("(problem:Problem)")
        .optionalMatch("(problem)<-[:BELONGS]-(:Action)<-[implements:IMPLEMENTS]-(user:User)")
        .return("problem.problemId AS problemId, problem.description AS description, problem.created AS created, " +
            "COUNT(implements) AS numberOfImplementations, " +
            "EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(problem)) AS isAdmin")
        .orderBy("numberOfImplementations DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({
            userId: userId,
            skip: skip,
            limit: limit
        })
        .send().then(function (resp) {
            return {problems: resp};
        });
};

var getProblem = function (userId, problemId) {

    return db.cypher().match("(problem:Problem {problemId: {problemId}})")
        .return("problem.description AS description, problem.created AS created, " +
            "EXISTS((:User {userId: {userId}})-[:IS_ADMIN]->(problem)) AS isAdmin")
        .end({
            problemId: problemId,
            userId: userId
        })
        .send().then(function (resp) {
            return resp[0];
        });
};


module.exports = {
    createProblem: createProblem,
    getProblems: getProblems,
    getProblem: getProblem
};
