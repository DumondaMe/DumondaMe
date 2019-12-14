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

const addOneTimeNotificationFirstAnswer = function (userId, created) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeFirstAnswer'}))`)
        .optionalMatch(`(u)-[:IS_CREATOR]->(a:Answer)`)
        .with(`COUNT(a) AS numberOfAnswers, u`)
        .where(`numberOfAnswers = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeFirstAnswer', ` +
            `created: {created}, notificationId: randomUUID()})`)
        .return('u')
        .end({userId, created})
};

const addOneTimeNotificationChallengeCreateCommitment = function (userId, created) {
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeChallengeCreateCommitment'})) AND ` +
            `NOT EXISTS((u)-[:IS_CREATOR]->(:Commitment))`)
        .optionalMatch(`(u)-[:IS_CREATOR]->(a:Answer)`)
        .with(`COUNT(a) AS numberOfAnswers, u`)
        .where(`numberOfAnswers = 2`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeChallengeCreateCommitment', ` +
            `created: {created}, notificationId: randomUUID()})`)
        .return('u')
        .end({userId, created})
};

const addCreatedAnswerNotification = async function (userId, answerId, created) {

    let response = await createNotificationForCreatorOfQuestion(userId, answerId, created).send(
        [createNotificationForUserWatchingQuestion(userId, answerId, created).getCommand(),
            createNotificationForUserTrustingCreatorOfAnswer(userId, answerId, created).getCommand(),
            addOneTimeNotificationFirstAnswer(userId, created).getCommand(),
            addOneTimeNotificationChallengeCreateCommitment(userId, created).getCommand()]
    );
    return response[2].length === 1 || response[3].length === 1;
};

module.exports = {
    addCreatedAnswerNotification
};
