'use strict';

const db = requireDb();
const uuid = require('dumonda-me-server-lib').uuid;

const addOneTimeNotificationFirstTrustCircleUser = function (userId, created) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match(`(u:User {userId: {userId}})`)
        .where(`NOT EXISTS((u)<-[:NOTIFIED]-(:Notification {type: 'oneTimeFirstTrustCircleUser'}))`)
        .optionalMatch(`(u)-[:IS_CONTACT]->(contact:User)`)
        .with(`COUNT(contact) AS numberOfContacts, u`)
        .where(`numberOfContacts = 1`)
        .merge(`(u)<-[:NOTIFIED]-(n:Notification:Unread:OneTime:NoEmail {type: 'oneTimeFirstTrustCircleUser', ` +
            `created: {created}, notificationId: {notificationId}})`)
        .return('u')
        .end({userId, notificationId, created})
};

const addOneTimeNotifications = async function (userId, created) {
    let response = await addOneTimeNotificationFirstTrustCircleUser(userId, created).send();
    return {oneTimeNotificationCreated: response.length === 1};
};


module.exports = {
    addOneTimeNotifications
};
