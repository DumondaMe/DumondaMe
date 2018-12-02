'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;

const addCreatedNoteNotification = function (userId, noteId, created) {
    let notificationId = uuid.generateUUID();
    return db.cypher()
        .match(`(creatorNote:User {userId: {userId}})-[:IS_CREATOR]->(note:Note {noteId: {noteId}})
                 <-[:NOTE]-(answer:Answer)<-[:ANSWER]-(question:Question)`)
        .with(`creatorNote, note, answer, question`)
        .match(`(answer)<-[:IS_CREATOR]-(creatorAnswer:User)`)
        .where(`creatorNote.userId <> creatorAnswer.userId`)
        .create(`(n:Notification:Unread {type: 'createdNote', created: {created}, 
                 notificationId: {notificationId}})`)
        .merge(`(n)-[:NOTIFIED]->(creatorAnswer)`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {created}}]->(creatorNote)`)
        .merge(`(n)-[:NOTIFICATION]->(answer)`)
        .merge(`(n)-[:NOTIFICATION]->(question)`)
        .merge(`(n)-[:NOTIFICATION]->(note)`)
        .end({userId, noteId, notificationId, created});
};

module.exports = {
    addCreatedNoteNotification
};
