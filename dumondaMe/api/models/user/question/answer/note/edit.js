const db = requireDb();
const time = require('dumonda-me-server-lib').time;
const exceptions = require('dumonda-me-server-lib').exceptions;
const linkifyHtml = require('linkifyjs/html');
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const security = async function (userId, noteId) {
    let resp = await db.cypher()
        .match(`(:User {userId: {userId}})-[rel:IS_CREATOR]->(:Note {noteId: {noteId}})`)
        .return(`rel`)
        .end({noteId, userId}).send();
    if (resp.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not allowed to edit the note ${noteId}`);
    }
};

const editNote = async function (userId, noteId, text) {
    await security(userId, noteId);
    await db.cypher().match(`(user:User {userId: {userId}})-[:IS_CREATOR]->(note:Note {noteId: {noteId}})`)
        .set('note', {text, modified: time.getNowUtcTimestamp()})
        .end({noteId, userId}).send();

    logger.info(`User ${userId} has edit a note ${noteId}`);
    return {textHtml: linkifyHtml(text)};
};


module.exports = {
    editNote
};