'use strict';

const db = requireDb();

const createNewQuestionNotifications = function (userId, questionId, created) {
    return db.cypher()
        .match(`(q:Question {questionId: {questionId}})<-[:IS_CREATOR]-(creator:User {userId: {userId}})` +
            `<-[:IS_CONTACT]-(notifiedUser:User)`)
        .create(`(notification:Notification:Unread {type: 'newQuestion', created: {created},` +
            `notificationId: randomUUID()})`)
        .merge(`(creator)<-[:ORIGINATOR_OF_NOTIFICATION {created: {created}}]-(notification)`)
        .merge(`(notification)-[:NOTIFICATION]->(q)`)
        .merge(`(notification)-[:NOTIFIED]->(notifiedUser)`)
        .end({userId, questionId, created})
};

const addOneTimeNotificationFirstQuestion = function (userId, created) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeFirstQuestion'}))`)
        .optionalMatch(`(u)-[:IS_CREATOR]->(q:Question)`)
        .with(`COUNT(q) AS numberOfQuestions, u`)
        .where(`numberOfQuestions = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeFirstQuestion', ` +
            `created: {created}, notificationId: randomUUID()})`)
        .return('u')
        .end({userId, created})
};

const addNotifications = async function (userId, questionId, created) {

    let response = await createNewQuestionNotifications(userId, questionId, created).send(
        [addOneTimeNotificationFirstQuestion(userId, created).getCommand()]);
    return response[0].length === 1;
};

module.exports = {
    addNotifications
};
