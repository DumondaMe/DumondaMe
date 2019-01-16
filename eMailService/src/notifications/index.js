"use strict";

const db = requireDb();
const eMail = require('dumonda-me-server-lib').eMail;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const LIMIT = 50;

const resetFailedNotifications = async function (allFailedNotifications) {
    for (let failedNotifications of allFailedNotifications) {
        await db.cypher().match(`(notification:Notification:Unread)`)
            .where(`notification.notificationId IN {failedNotifications}`)
            .remove(`notification:EmailSent`).end({failedNotifications}).send();
    }
};

const sendEMails = async function (users) {
    let failedNotifications = [];
    for (let user of users) {
        try {
            let unsubscribeLink = `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/${user.email}`;
            await eMail.sendEMail('notification',
                {unsubscribeLink, numberOfNotifications: user.numberOfNotifications}, user.language, user.email);
            logger.info(`Send new notification email to ${user.email}`);
        } catch (error) {
            failedNotifications.push(user.notificationIds);
            logger.error(`Failed to send notification E-Mail to user ${user.email}`);
        }
    }
    if (failedNotifications.length > 0) {
        await resetFailedNotifications(failedNotifications)
    }

};

const sendUnreadNotifications = async function () {
    let skip = 0, users = [];
    do {
        users = await db.cypher()
            .match(`(user:User:EMailNotificationEnabled)<-[:NOTIFIED]-(notification:Notification:Unread)`)
            .where(`NOT notification:EmailSent AND NOT EXISTS(user.disableNewNotificationEmail)`)
            .addCommand(` SET notification:EmailSent`)
            .return(`DISTINCT user.emailNormalized AS email, user.language AS language, 
                     COUNT(notification) AS numberOfNotifications, 
                     collect(notification.notificationId) AS notificationIds`)
            .orderBy(`user.emailNormalized`)
            .skip(skip)
            .limit(LIMIT).end().send();
        await sendEMails(users);

    } while (users.length === LIMIT);
};


module.exports = {
    sendUnreadNotifications
};
