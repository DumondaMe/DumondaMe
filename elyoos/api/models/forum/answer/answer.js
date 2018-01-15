'use strict';

let db = requireDb();
let moment = require('moment');
let uuid = require('elyoos-server-lib').uuid;
let security = require('./../security');
let securityAnswer = require('./security');

let createPageReference = function (pageId) {
    let command = db.cypher();
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

let createAnswer = function (userId, questionId, title, description, type, pageId, req) {

    let timeCreatedExplanation = Math.floor(moment.utc().valueOf() / 1000),
        answerId = uuid.generateUUID();
    return security.questionExists(questionId, req).then(function () {
        return db.cypher().match("(u:User {userId: {userId}}), (forumQuestion:ForumQuestion {questionId: {questionId}})")
            .createUnique(`(u)-[:IS_ADMIN]->(answer:ForumAnswer {answerId: {answerId}, description: {description}, type: {type}, 
                title: {title}, created: {timeCreatedQuestion}})<-[:IS_ANSWER]-(forumQuestion)`)
            .addCommand(createPageReference(pageId))
            .end({
                userId: userId,
                title: title,
                description: description,
                type: type,
                timeCreatedQuestion: timeCreatedExplanation,
                answerId: answerId,
                questionId: questionId,
                pageId: pageId
            }).send();
    }).then(function (resp) {
        return {answerId: resp[0].answerId};
    });
};

let deleteAnswer = function (userId, answerId, req) {
    return securityAnswer.allowedToDeleteAnswer(userId, answerId, req).then(function () {
        return db.cypher().match("(answer:ForumAnswer {answerId: {answerId}})")
            .optionalMatch("(answer)-[r]-()")
            .delete("answer, r")
            .end({answerId: answerId}).send();
    });
};


module.exports = {
    createAnswer: createAnswer,
    deleteAnswer: deleteAnswer
};