'use strict';

var db = require('./../../../neo4j');
var moment = require('moment');
var uuid = require('./../../../lib/uuid');

var createQuestion = function (userId, description, category, language) {

    var timeCreatedQuestion = Math.floor(moment.utc().valueOf() / 1000),
        questionId = uuid.generateUUID();
    return db.cypher().match("(u:User {userId: {userId}})")
        .createUnique("(u)-[:IS_ADMIN]->(question:ForumQuestion {questionId: {questionId}, description: {description}, category: {category}, " +
            "language: {language}, created: {timeCreatedQuestion}})")
        .return("question.questionId AS questionId")
        .end({
            userId: userId,
            description: description,
            category: category,
            language: language,
            timeCreatedQuestion: timeCreatedQuestion,
            questionId: questionId
        })
        .send().then(function (resp) {
            return {questionId: resp[0].questionId};
        });
};


module.exports = {
    createQuestion: createQuestion
};
