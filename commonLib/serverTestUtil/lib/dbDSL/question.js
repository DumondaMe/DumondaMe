'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createQuestion = function (questionId, data) {
    data.description = data.description || null;
    data.created = data.created || 500;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorId}})')
        .create(`(question:Question {questionId: {questionId}, question: {question}, description: {description}, 
                  created: {created}, modified: {modified}, language: {language}})`)
        .merge(`(question)<-[:IS_CREATOR]-(user)`)
        .with(`question`)
        .match(`(topic:Topic)`)
        .where(`topic.topicId IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(question)`)
        .end({
            question: data.question, description: data.description, topics: data.topics, created: data.created,
            modified: data.modified, questionId: questionId, language: data.language, creatorId: data.creatorId
        }).getCommand());
};

const watchQuestion = function (data) {
    data.created = data.created || 555;
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(q:Question {questionId: {questionId}}), (u:User {userId: {userId}})`)
        .merge(`(q)<-[:WATCH {created: {created}}]-(u)`)
        .end({questionId: data.questionId, userId: data.userId, created: data.created}).getCommand());
};

const addSuggestionToQuestion = function (data) {
    data.created = data.created || 555;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(q:Question {questionId: {questionId}}), (u:User {userId: {userId}})`)
        .addCommand(` SET u :SuperUser`)
        .create(`(suggestion:QuestionSuggestion {suggestionId: {suggestionId}, 
                  title: {title}, description: {description}, explanation: {explanation},
                  created: {created}, modified: {modified}, open: {open}})`)
        .merge(`(q)<-[:SUGGESTION]-(suggestion)`)
        .merge(`(suggestion)<-[:IS_CREATOR]-(u)`)
        .end({
            questionId: data.questionId, suggestionId: data.suggestionId, userId: data.userId, created: data.created,
            modified: data.modified, title: data.title, description: data.description, explanation: data.explanation,
            open: data.open
        }).getCommand());
};

const inviteRegisteredUserToAnswerQuestion = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(q:Question {questionId: {questionId}}), (u:User {userId: {userId}}), 
                (invitedUser:User {userId: {userIdOfUserToInvite}})`)
        .merge(`(u)-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:QUESTION_TO_ANSWER]->(q)`)
        .merge(`(asked)-[:ASKED]->(invitedUser)`)
        .end({
            questionId: data.questionId, userId: data.userId, userIdOfUserToInvite: data.userIdOfUserToInvite
        }).getCommand());
};

const invitePreviouslyInvitedUserToAnswerQuestion = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(q:Question {questionId: {questionId}}), (u:User {userId: {userId}})`)
        .merge(`(u)-[:ASKED_TO_ANSWER_QUESTION]->(asked:AskedToAnswerQuestion)-[:QUESTION_TO_ANSWER]->(q)`)
        .merge(`(invitedUser:InvitedUser:EMailNotificationEnabled {emailNormalized: {emailOfUserToInvite}})`)
        .merge(`(asked)-[:ASKED]->(invitedUser)`)
        .end({
            questionId: data.questionId, userId: data.userId, emailOfUserToInvite: data.emailOfUserToInvite
        }).getCommand());
};

module.exports = {
    createQuestion,
    watchQuestion,
    addSuggestionToQuestion,
    inviteRegisteredUserToAnswerQuestion,
    invitePreviouslyInvitedUserToAnswerQuestion
};