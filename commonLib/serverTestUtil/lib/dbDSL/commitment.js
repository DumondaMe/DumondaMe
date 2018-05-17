'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');

const createCommitment = function (commitmentId, data) {
    data.title = data.title || `commitment${commitmentId}Title`;
    data.description = data.description || `commitment${commitmentId}Description`;
    data.website = data.website || null;
    data.modified = data.modified || null;
    data.modifiedAddress = data.modifiedAddress || data.created;
    data.importTC = data.importTC ? ':ImportTC' : '';
    data.regions = data.regions || null;
    dbConnectionHandling.getCommands().push(db.cypher().match("(user:User {userId: {adminId}})")
        .create(`(user)-[:IS_ADMIN]->(commitment:Commitment${data.importTC} {title: {title}, language: {language}, description: {description}, modified: {modified}, modifiedAddress: {modifiedAddress}, 
        created: {created}, commitmentId: {commitmentId}, website: {website}})`)
        .with(`commitment, user`)
        .merge(`(user)-[:IS_CREATOR]->(commitment)`)
        .with(`commitment`)
        .foreach(`(topic IN {topics} | MERGE (:Topic {name: topic}))`)
        .with(`commitment`)
        .match(`(topic:Topic)`)
        .where(`topic.name IN {topics}`)
        .merge(`(topic)-[:TOPIC]->(commitment)`)
        .with(`commitment`)
        .match(`(region:Region)`)
        .where(`region.code IN {regions}`)
        .merge(`(region)<-[:BELONGS_TO_REGION]-(commitment)`)
        .end({
            commitmentId: commitmentId,
            adminId: data.adminId,
            title: data.title,
            description: data.description,
            language: data.language,
            topics: data.topics,
            created: data.created,
            modified: data.modified,
            modifiedAddress: data.modifiedAddress,
            website: data.website,
            regions: data.regions
        }).getCommand());
};

const showQuestionOnCommitment = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(c:Commitment {commitmentId: {commitmentId}}), (q:Question {questionId: {questionId}})`)
        .merge(`(q)<-[:SHOW_QUESTION]-(c)`)
        .end({commitmentId: data.commitmentId, questionId: data.questionId}).getCommand());
};

const watchCommitment = function (data) {
    data.created = data.created || 555;
    dbConnectionHandling.getCommands().push(db.cypher()
        .match(`(c:Commitment {commitmentId: {commitmentId}}), (u:User {userId: {userId}})`)
        .merge(`(c)<-[:WATCH {created: {created}}]-(u)`)
        .end({commitmentId: data.commitmentId, userId: data.userId, created: data.created}).getCommand());
};

module.exports = {
    createCommitment,
    showQuestionOnCommitment,
    watchCommitment
};