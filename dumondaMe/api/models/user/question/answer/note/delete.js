const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const security = async function (userId, noteId) {
    let resp = await db.cypher()
        .match(`(:User {userId: {userId}})-[rel:IS_CREATOR]->(:Note {noteId: {noteId}})`)
        .return(`rel`)
        .end({noteId, userId}).send();
    if (resp.length === 0) {
        throw new exceptions.InvalidOperation(`User ${userId} is not allowed to delete the note ${noteId}`);
    }
};

const deleteNote = async function (userId, noteId) {
    await security(userId, noteId);
    await db.cypher().match(`(user:User {userId: {userId}})-[:IS_CREATOR]->(note:Note {noteId: {noteId}})`)
        .optionalMatch(`(note)-[rel]-()`)
        .delete(`note, rel`)
        .end({noteId, userId}).send();

    logger.info(`User ${userId} has deleted the note ${noteId}`);
};


module.exports = {
    deleteNote
};