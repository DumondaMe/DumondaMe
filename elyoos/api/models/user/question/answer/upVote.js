'use strict';

const db = requireDb();
const time = require('elyoos-server-lib').time;
const exceptions = require('elyoos-server-lib').exceptions;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const validToUpVoteAnswer = async function (userId, answerId) {

    let result = await db.cypher().match(`(user:User {userId: {userId}})-[:UP_VOTE|IS_CREATOR]->
                                          (answer:Answer {answerId: {answerId}})`)
        .return(`answer`).end({answerId, userId}).send();
    if (result.length > 0) {
        throw new exceptions.InvalidOperation(
            `User ${userId} has already up voted answer or is admin of answer ${answerId}`);
    }
};

const upVote = async function (userId, answerId) {
    await validToUpVoteAnswer(userId, answerId);
    await db.cypher().match("(user:User {userId: {userId}}), (answer:Answer {answerId: {answerId}})")
        .merge(`(user)-[:UP_VOTE {created: {created}}]->(answer)`)
        .end({answerId, userId, created: time.getNowUtcTimestamp()}).send();
    logger.info(`User ${userId} up voted answer ${answerId}`);
};

module.exports = {
    upVote
};
