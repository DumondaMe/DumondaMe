'use strict';

var db = require('./../../../neo4j');
var moment = require('moment');
var uuid = require('./../../../lib/uuid');
var security = require('./../security');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var createPageReference = function (pageId) {
    var command = db.cypher();
    if (pageId) {
        command.with("answer")
            .match("(page:Page {pageId: {pageId}})")
            .createUnique("(page)<-[:REFERENCE]-(answer)")
            .return("answer.answerId AS answerId");
    } else {
        command.return("answer.answerId AS answerId");
    }
    return command.getCommandString();
};

var getAnswerLabel = function (type, req) {
    switch (type) {
        case "explanation":
            return "answer:ForumExplanation:ForumAnswer";
        case "solution":
            return "answer:ForumSolution:ForumAnswer";
    }
    return exceptions.getInvalidOperation("Unknown type: " + type, logger, req);
};

var createAnswer = function (userId, questionId, title, description, type, pageId, req) {

    var timeCreatedExplanation = Math.floor(moment.utc().valueOf() / 1000),
        answerId = uuid.generateUUID();
    return security.questionExists(questionId, req).then(function () {
        return db.cypher().match("(u:User {userId: {userId}}), (forumQuestion:ForumQuestion {questionId: {questionId}})")
            .createUnique("(u)-[:IS_ADMIN]->(" + getAnswerLabel(type, req) + " {answerId: {answerId}, description: {description}, " +
                "title: {title}, created: {timeCreatedQuestion}})<-[:IS_ANSWER]-(forumQuestion)")
            .addCommand(createPageReference(pageId))
            .end({
                userId: userId,
                title: title,
                description: description,
                timeCreatedQuestion: timeCreatedExplanation,
                answerId: answerId,
                questionId: questionId,
                pageId: pageId
            })
            .send().then(function (resp) {
                return {answerId: resp[0].answerId};
            });
    });
};


module.exports = {
    createAnswer: createAnswer
};
