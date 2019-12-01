"use strict";

const db = requireDb();
const previewNotification = require('./preview');
const titleNotification = require('./title');
const eMail = require('dumonda-me-server-lib').eMail;
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const LIMIT = 50;

const resetFailedNotifications = async function (allFailedNotifications) {
    for (let failedNotifications of allFailedNotifications) {
        await db.cypher().match(`(notification:Notification:Unread)`)
            .where(`notification.notificationId IN {failedNotifications}`)
            .remove(`notification:EmailSent`).end({failedNotifications}).send();
    }
};

const setLastEmailSent = async function (userId) {
    await db.cypher().match(`(user:User {userId: {userId}})`)
        .set(`user`, {lastEmailSent: time.getNowUtcTimestamp()})
        .end({userId}).send();
};


const sendEMails = async function (users) {
    let failedNotifications = [];
    for (let user of users) {
        try {
            let unsubscribeLink = `${process.env.DUMONDA_ME_DOMAIN}unsubscribe/notifications/${user.email}`;
            let preview = await previewNotification.getPreviewOfNotification(user.notifications,
                user.numberOfNotifications, user.language);
            let title = titleNotification.getTitleOfNotification(user.notifications, user.numberOfNotifications,
                user.language);
            await eMail.sendEMail('notification', {unsubscribeLink, preview, title}, user.language, user.email);
            logger.info(`Send new notification email to ${user.email}`);
            await setLastEmailSent(user.userId);
        } catch (error) {
            failedNotifications.push(user.notificationIds);
            logger.error(`Failed to send notification E-Mail to user ${user.email}`, error);
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
            .where(`NOT notification:EmailSent AND NOT EXISTS(user.disableNewNotificationEmail) ` +
                `AND NOT user:HarvestingUser AND (user.lastEmailSent + user.emailNotificationInterval < {now} OR ` +
                `NOT EXISTS (user.lastEmailSent))`)
            .optionalMatch(`(notification)-[originatorRel:ORIGINATOR_OF_NOTIFICATION]->(originator:User)`)
            .with(`user, notification, originator, originatorRel`)
            .orderBy(`notification.created DESC, originatorRel.created DESC`)
            .with(`user, notification, collect({originator:originator, ` +
                `isContact: EXISTS((user)<-[:IS_CONTACT]-(originator))}) AS originators`)
            .optionalMatch(`(notification)-[:NOTIFICATION]->(notificationObject)`)
            .with(`user, notification, originators, collect(notificationObject) AS notificationObjects`)
            .addCommand(` SET notification:EmailSent`)
            .return(`DISTINCT user.emailNormalized AS email, user.language AS language, user.userId AS userId,
                     COUNT(notification) AS numberOfNotifications, 
                     collect(notification.notificationId) AS notificationIds,
                     collect({notification: notification, originators: originators, 
                     notificationObjects: notificationObjects}) AS notifications`)
            .orderBy(`user.emailNormalized`)
            .skip(skip)
            .limit(LIMIT).end({now: time.getNowUtcTimestamp()}).send();
        await sendEMails(users);

    } while (users.length === LIMIT);
};


module.exports = {
    sendUnreadNotifications
};
