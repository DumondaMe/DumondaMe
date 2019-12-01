'use strict';

const db = requireDb();

const getCreateNotificationCommand = function () {
    return db.cypher().create(`(n:Notification:Unread {type: 'createdAnswer', created: {created}, 
                 notificationId: randomUUID()})`)
        .merge(`(n)-[:NOTIFIED]->(notifiedUser)`)
        .merge(`(n)-[:ORIGINATOR_OF_NOTIFICATION {created: {created}}]->(originator)`)
        .merge(`(n)-[:NOTIFICATION]->(answer)`)
        .merge(`(n)-[:NOTIFICATION]->(question)`)
        .with(`n, answer`)
        .match(`(answer)-[:COMMITMENT]->(commitment:Commitment)`)
        .merge(`(n)-[:NOTIFICATION]->(commitment)`).getCommandString();
};

const createNotificationForCreatorOfQuestion = function (userId, answerId, created) {
    return db.cypher()
        .match(`(originator:User {userId: {userId}})-[:IS_CREATOR]->(answer:Answer {answerId: {answerId}})
         <-[:ANSWER]-(question:Question)<-[:IS_CREATOR]-(notifiedUser:User)`)
        .where(`originator.userId <> notifiedUser.userId`)
        .addCommand(getCreateNotificationCommand())
        .end({userId, answerId, created})
};

const createNotificationForUserWatchingQuestion = function (userId, answerId, created) {
    return db.cypher()
        .match(`(originator:User {userId: {userId}})-[:IS_CREATOR]->(answer:Answer {answerId: {answerId}})
         <-[:ANSWER]-(question:Question)<-[:WATCH]-(notifiedUser:User)`)
        .where(`originator.userId <> notifiedUser.userId`)
        .addCommand(getCreateNotificationCommand())
        .end({userId, answerId, created})
};

const createNotificationForUserTrustingCreatorOfAnswer = function (userId, answerId, created) {
    return db.cypher()
        .match(`(notifiedUser:User)-[:IS_CONTACT]->(originator:User {userId: {userId}})-[:IS_CREATOR]->(answer:Answer {answerId: {answerId}})
         <-[:ANSWER]-(question:Question)`)
        .where(` NOT (notifiedUser)-[:WATCH]->(question) AND NOT (notifiedUser)-[:IS_CREATOR]->(question)`)
        .addCommand(getCreateNotificationCommand())
        .end({userId, answerId, created})
};

const addCreatedAnswerNotification = async function (userId, answerId, created) {

    await createNotificationForCreatorOfQuestion(userId, answerId, created).send(
        [createNotificationForUserWatchingQuestion(userId, answerId, created).getCommand(),
            createNotificationForUserTrustingCreatorOfAnswer(userId, answerId, created).getCommand()]
    );

};

module.exports = {
    addCreatedAnswerNotification
};
