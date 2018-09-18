'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;

const addCreatedAnswerNotification = function (userId, answerId, created) {
    let notificationId = uuid.generateUUID();
    return db.cypher()
        .match(`(creatorAnswer:User {userId: {userId}})-[:IS_CREATOR]->(answer:Answer {answerId: {answerId}})
         <-[:ANSWER]-(question:Question)<-[:IS_CREATOR]-(creatorQuestion:User)`)
        .where(`creatorAnswer.userId <> creatorQuestion.userId`)
        .create(`(n:Notification {type: 'createdAnswer', created: {created}, 
                 notificationId: {notificationId}})`)
        .merge(`(n)-[:NOTIFIED]->(creatorQuestion)`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {created}}]->(creatorAnswer)`)
        .merge(`(n)-[:NOTIFICATION]->(answer)`)
        .merge(`(n)-[:NOTIFICATION]->(question)`)
        .with(`n, answer`)
        .match(`(answer)-[:COMMITMENT]->(commitment:Commitment)`)
        .merge(`(n)-[:NOTIFICATION]->(commitment)`)
        .end({userId, answerId, notificationId, created});
};

module.exports = {
    addCreatedAnswerNotification
};
