'use strict';

const db = requireDb();
const security = require('./security');

const removeNotification = function (userId, commitmentId, questionId) {
    return db.cypher()
        .match(`(:Commitment {commitmentId: {commitmentId}})<-[:NOTIFICATION]-(n:Notification)
                 -[:NOTIFICATION]->(:Question {questionId: {questionId}})`)
        .optionalMatch(`(n)-[rel]-()`)
        .delete(`n, rel`)
        .end({commitmentId, questionId});
};

const setShowQuestion = function (commitmentId, questionId) {
    return db.cypher()
        .match(`(c:Commitment {commitmentId: {commitmentId}}), (q:Question {questionId: {questionId}})`)
        .merge(`(c)-[:SHOW_QUESTION]->(q)`)
        .end({commitmentId, questionId}).getCommand();
};

const showQuestion = async function (userId, commitmentId, questionId, showQuestion) {
    let commands = null;
    await security.isAdmin(userId, commitmentId);
    if (showQuestion) {
        commands = [setShowQuestion(commitmentId, questionId)];
    }
    await removeNotification(userId, commitmentId, questionId).send(commands);
};

module.exports = {
    showQuestion
};
