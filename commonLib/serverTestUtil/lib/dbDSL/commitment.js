'use strict';

const db = require('../db');
const dbConnectionHandling = require('./dbConnectionHandling');

const createCommitment = function (answerId, data) {
    data.title = data.title || `commitment${answerId}Title`;
    data.description = data.description || `commitment${answerId}Description`;
    data.website = data.website || null;
    data.modified = data.modified || null;
    data.modifiedAddress = data.modifiedAddress || data.created;
    data.importTC = data.importTC ? ':ImportTC' : '';
    data.regions = data.regions || null;
    dbConnectionHandling.getCommands().push(db.cypher().match("(user:User {userId: {adminId}})")
        .create(`(user)-[:IS_ADMIN]->(commitment:Answer:Commitment${data.importTC} {title: {title}, language: {language}, description: {description}, modified: {modified}, modifiedAddress: {modifiedAddress}, 
        created: {created}, answerId: {answerId}, website: {website}}) 
        foreach (topic in {topics} | MERGE (:Topic {name: topic})-[:TOPIC]->(commitment))`)
        .with(`commitment`)
        .match(`(region:Region)`)
        .where(`region.code IN {regions}`)
        .merge(`(region)<-[:BELONGS_TO_REGION]-(commitment)`)
        .end({
            answerId: answerId,
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

module.exports = {
    createCommitment
};