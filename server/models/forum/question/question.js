'use strict';

var db = require('./../../../neo4j');
var moment = require('moment');
var uuid = require('./../../../lib/uuid');
var security = require('./security');

var createQuestion = function (userId, description, topic, language) {

    var timeCreatedQuestion = Math.floor(moment.utc().valueOf() / 1000),
        questionId = uuid.generateUUID();
    return db.cypher().match("(u:User {userId: {userId}})")
        .createUnique("(u)-[:IS_ADMIN]->(question:ForumQuestion {questionId: {questionId}, description: {description}, topic: {topic}, " +
            "language: {language}, created: {timeCreatedQuestion}})")
        .return("question.questionId AS questionId")
        .end({
            userId: userId,
            description: description,
            topic: topic,
            language: language,
            timeCreatedQuestion: timeCreatedQuestion,
            questionId: questionId
        })
        .send().then(function (resp) {
            return {questionId: resp[0].questionId};
        });
};

var deleteQuestion = function (userId, questionId, req) {
    return security.allowedToDeleteQuestion(userId, questionId, req).then(function () {
        return db.cypher().match("(question:ForumQuestion {questionId: {questionId}})")
            .optionalMatch("(question)-[r]-()")
            .optionalMatch("(question)-[:IS_ANSWER]->(answer:ForumAnswer)-[ar]-()")
            .delete("question, answer, r, ar")
            .end({questionId: questionId}).send();
    });
};


module.exports = {
    createQuestion: createQuestion,
    deleteQuestion: deleteQuestion
};
