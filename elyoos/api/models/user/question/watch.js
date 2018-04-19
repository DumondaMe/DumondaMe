'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const addWatch = async function (userId, questionId) {
    let created = time.getNowUtcTimestamp();
    let response = await db.cypher()
        .match(`(user:User {userId: {userId}}), (question:Question {questionId: {questionId}})`)
        .where(`NOT (user)-[:WATCH]->(question) AND NOT (user)-[:IS_CREATOR]->(question)`)
        .merge(`(user)-[:WATCH {created: {created}}]->(question)`)
        .return(`user`)
        .end({userId, questionId, created}).send();

    if (response.length === 0) {
        throw new exceptions.InvalidOperation(`Watch could not be added from user ${userId} to question ${questionId}`);
    }

    logger.info(`User watches question ${questionId}`)
};

const removeWatch = async function (userId, questionId) {

    await db.cypher()
        .match(`(:User {userId: {userId}})-[watch:WATCH]->(:Question {questionId: {questionId}})`)
        .delete(`watch`)
        .end({userId, questionId}).send();

    logger.info(`User removed watch of question ${questionId}`)
};

module.exports = {
    addWatch,
    removeWatch
};
