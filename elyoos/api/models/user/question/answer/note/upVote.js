const db = requireDb();
const time = require('elyoos-server-lib').time;
const exceptions = require('elyoos-server-lib').exceptions;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const security = async function (userId, noteId) {
    let resp = await db.cypher()
        .match(`(:User {userId: {userId}})-[rel:IS_CREATOR|UP_VOTE]->(:Note {noteId: {noteId}})`)
        .return(`rel`)
        .end({noteId, userId}).send();
    if (resp.length > 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not allowed to up vote the note ${noteId}`);
    }
};

const deleteUpVote = async function (userId, noteId) {
    await db.cypher().match(`(:User {userId: {userId}})-[upVote:UP_VOTE]->(:Note {noteId: {noteId}})`)
        .delete(`upVote`)
        .end({noteId, userId}).send();
    logger.info(`User ${userId} has deleted an up vote of the note ${noteId}`);
};

const upVote = async function (userId, noteId) {
    await security(userId, noteId);
    await db.cypher().match(`(user:User {userId: {userId}}), (note:Note {noteId: {noteId}})`)
        .merge(`(user)-[:UP_VOTE {created: {created}}]->(note)`)
        .end({noteId, userId, created: time.getNowUtcTimestamp()}).send();
    logger.info(`User ${userId} has up voted the note ${noteId}`);
};

module.exports = {
    deleteUpVote,
    upVote
};