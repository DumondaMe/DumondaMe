'use strict';

const dashify = require('dashify');
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
        .match(`(q:Question {questionId: {questionId}})-[:ANSWER]->(answer:CommitmentAnswer)-[:COMMITMENT]->
                (c:Commitment {commitmentId: {commitmentId}})`)
        .merge(`(c)-[:SHOW_QUESTION]->(q)`)
        .with(`q, c, answer`)
        .optionalMatch(`(answer)<-[relUpVotes:UP_VOTE]-(:User)`)
        .return(`q.question AS question, q.description AS description, count(relUpVotes) AS upVotes`)
        .end({commitmentId, questionId}).getCommand();
};

const showQuestion = async function (userId, commitmentId, questionId, showQuestion) {
    let commands = null;
    await security.isAdmin(userId, commitmentId);
    if (showQuestion) {
        commands = [setShowQuestion(commitmentId, questionId)];
    }
    let resp = await removeNotification(userId, commitmentId, questionId).send(commands);
    if (showQuestion && resp[0].length === 1) {
        let question = resp[0][0];
        question.slug = dashify(question.question);
        return question;
    }
    return {};
};

module.exports = {
    showQuestion
};
