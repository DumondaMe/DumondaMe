const db = requireDb();
const time = require('elyoos-server-lib').time;
const uuid = require('elyoos-server-lib').uuid;
const exceptions = require('elyoos-server-lib').exceptions;
const linkifyHtml = require('linkifyjs/html');
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const createNote = async function (userId, answerId, text) {
    let response = {
        noteId: uuid.generateUUID(),
        created: time.getNowUtcTimestamp()
    };
    text = linkifyHtml(text);
    let res = await db.cypher().match(`(user:User {userId: {userId}}), (answer:Answer {answerId: {answerId}})`)
        .where(`NOT answer:CommitmentAnswer`)
        .create(`(note:Note {noteId: {noteId}, text: {text}, created: {created}})`)
        .merge(`(user)-[:IS_CREATOR]->(note)<-[:NOTE]-(answer)`)
        .return(`note`)
        .end({answerId, userId, text, created: response.created, noteId: response.noteId}).send();
    logger.info(`User ${userId} has created a note ${answerId}`);
    if (res.length === 0) {
        throw new exceptions.InvalidOperation(`Note for answer ${answerId} not created`);
    }
    return response;
};


module.exports = {
    createNote
};