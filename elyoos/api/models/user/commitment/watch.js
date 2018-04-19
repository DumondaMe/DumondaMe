'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const addWatch = async function (userId, commitmentId) {
    let created = time.getNowUtcTimestamp();
    let response = await db.cypher()
        .match(`(user:User {userId: {userId}}), (commitment:Commitment {commitmentId: {commitmentId}})`)
        .where(`NOT (user)-[:WATCH]->(commitment) AND NOT (user)-[:IS_ADMIN]->(commitment)`)
        .merge(`(user)-[:WATCH {created: {created}}]->(commitment)`)
        .return(`user`)
        .end({userId, commitmentId, created}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`Watch could not be added from user ${userId} to commitment ${commitmentId}`);
    }

    logger.info(`User watches commitment ${commitmentId}`)
};

const removeWatch = async function (userId, commitmentId) {

    await db.cypher()
        .match(`(:User {userId: {userId}})-[watch:WATCH]->(:Commitment {commitmentId: {commitmentId}})`)
        .delete(`watch`)
        .end({userId, commitmentId}).send();

    logger.info(`User removed watch of commitment ${commitmentId}`)
};

module.exports = {
    addWatch,
    removeWatch
};
