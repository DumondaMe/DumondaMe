'use strict';

var db = require('./../../../neo4j');
var moment = require('moment');
var uuid = require('./../../../lib/uuid');
var security = require('./../security');

var createPageReference = function (pageId) {
    var command = db.cypher();
    if (pageId) {
        command.with("solution")
            .match("(page:Page {pageId: {pageId}})")
            .createUnique("(page)<-[:REFERENCE]-(solution)")
            .return("solution.solutionId AS solutionId");
    } else {
        command.return("solution.solutionId AS solutionId");
    }
    return command.getCommandString();
};

var createSolution = function (userId, questionId, description, pageId, req) {

    var timeCreatedExplanation = Math.floor(moment.utc().valueOf() / 1000),
        solutionId = uuid.generateUUID();
    return security.questionExists(questionId, req).then(function () {
        return db.cypher().match("(u:User {userId: {userId}}), (forumQuestion:ForumQuestion {questionId: {questionId}})")
            .createUnique("(u)-[:IS_ADMIN]->(solution:ForumSolution {solutionId: {solutionId}, description: {description}, " +
                "created: {timeCreatedQuestion}})<-[:HAS_SOLUTION]-(forumQuestion)")
            .addCommand(createPageReference(pageId))
            .end({
                userId: userId,
                description: description,
                timeCreatedQuestion: timeCreatedExplanation,
                solutionId: solutionId,
                questionId: questionId,
                pageId: pageId
            })
            .send().then(function (resp) {
                return {solutionId: resp[0].solutionId};
            });
    });
};


module.exports = {
    createSolution: createSolution
};
