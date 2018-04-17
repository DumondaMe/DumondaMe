'use strict';

const dashify = require('dashify');
const db = requireDb();
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const getResponse = function (notifications) {
    let response = [];
    for (let notification of notifications) {
        let commitment = notification.infos.find((info) => typeof info.commitmentId === 'string');
        let question = notification.infos.find((info) => typeof info.questionId === 'string');
        response.push({
            created: notification.notification.created,
            type: notification.notification.type,
            commitmentId: commitment.commitmentId,
            commitmentTitle: commitment.title,
            commitmentSlug: dashify(commitment.title),
            questionId: question.questionId,
            question: question.question,
            questionSlug: dashify(question.question),
        });
    }
    return response;
};

const getNumberOfUnreadNotificationsCommand = function (userId) {
    return db.cypher().match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)`)
        .return(`COUNT(DISTINCT n) AS numberOfNotifications`)
        .end({userId}).getCommand();
};

const getNotifications = async function (userId) {
    let result = await db.cypher()
        .match(`(:User {userId: {userId}})<-[:NOTIFIED]-(n:Notification)-[:NOTIFICATION]->(info)`)
        .return(`n AS notification, collect(info) AS infos`)
        .orderBy(`n.created DESC`)
        .end({userId}).send([getNumberOfUnreadNotificationsCommand(userId)]);
    logger.info(`User ${userId} requested notifications`);
    return {
        notifications: getResponse(result[1]),
        numberOfNotifications: result[0][0].numberOfNotifications
    };
};

module.exports = {
    getNotifications
};
