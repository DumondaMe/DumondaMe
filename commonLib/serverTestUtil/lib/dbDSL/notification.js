'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');

const showQuestionOnCommitmentRequest = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(c:Commitment {commitmentId: {commitmentId}}), (admin:User {userId: {adminId}}), 
                (q:Question {questionId: {questionId}})`)
        .merge(`(q)<-[:NOTIFICATION]-(notification:Notification {type: 'showQuestionRequest', 
                                      created: {created}})-[:NOTIFIED]->(admin)`)
        .merge(`(c)<-[:NOTIFICATION]-(notification)`)
        .end({
            commitmentId: data.commitmentId,
            questionId: data.questionId,
            adminId: data.adminId,
            created: data.created
        }).getCommand());
};

module.exports = {
    showQuestionOnCommitmentRequest
};