'use strict';

const db = requireDb();
const uuid = require('elyoos-server-lib').uuid;
const moment = require('moment');

let validAddContactCommand = async function (userId, contactId) {
    let resp = await db.cypher().match(`(u:User {userId: {contactId}})`)
        .where(`u.privacyMode <> 'onlyContact' OR 
               (u.privacyMode = 'onlyContact' AND EXISTS((u)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return(`u`)
        .end({userId, contactId}).send();
    if (resp.length === 0) {
        throw new Error('401');
    }
};

let removeInvitation = function (userId, contactId) {
    return db.cypher().match('(u:User {userId: {userId}})<-[invitedRel:HAS_INVITED]-(u2:User {userId: {contactId}})')
        .delete('invitedRel')
        .end({userId, contactId});
};

let addUserAddedToTrustCircleNotificationExists = function (userId, contactId, contactAdded) {
    return db.cypher().match(`(u:User {userId: {userId}}), 
             (contact:User {userId: {contactId}})<-[:NOTIFIED]-(n:Notification {type: 'addedToTrustCircle'})`)
        .set(`n`, {created: contactAdded})
        .merge(`(n)-[:NOTIFICATION {created: {created}}]->(u)`)
        .end({userId, contactId}).getCommand()
};

let addUserAddedToTrustCircleNotificationNotExists = function (userId, contactId, contactAdded) {
    let notificationId = uuid.generateUUID();
    return db.cypher().match('(u:User {userId: {userId}}), (contact:User {userId: {contactId}})')
        .where(`NOT (contact)<-[:NOTIFIED]-(:Notification {type: 'addedToTrustCircle'})`)
        .merge(`(contact)<-[:NOTIFIED]-(:Notification {type: 'addedToTrustCircle', created: {contactAdded}, 
                 notificationId: {notificationId}})-[:NOTIFICATION {created: {contactAdded}}]->(u)`)
        .end({userId, contactId, contactAdded, notificationId}).getCommand()
};

let addPersonToTrustCircle = async function (userId, contactId) {
    await validAddContactCommand(userId, contactId);
    let commands = [], timeAddedContact = Math.floor(moment.utc().valueOf() / 1000);
    commands.push(db.cypher().match('(u:User {userId: {userId}}), (u2:User {userId: {contactId}})')
        .where('NOT (u)-[:IS_CONTACT]->(u2)')
        .merge('(u)-[:IS_CONTACT {contactAdded: {contactAdded}}]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_BLOCKED]->(u2)')
        .delete('r')
        .end({userId, contactId, contactAdded: timeAddedContact}).getCommand());
    commands.push(addUserAddedToTrustCircleNotificationExists(userId, contactId, timeAddedContact));
    commands.push(addUserAddedToTrustCircleNotificationNotExists(userId, contactId, timeAddedContact));

    await removeInvitation(userId, contactId).send(commands);
    return {personOfTrustSince: timeAddedContact};
};

let removeUserAddedToTrustCircleNotification = function (userId, contactId) {
    return db.cypher()
        .match(`(u:User {userId: {userId}})<-[rel:NOTIFICATION]-(notification:Notification {type: 'addedToTrustCircle'})
                 -[:NOTIFIED]->(contact:User {userId: {contactId}})`)
        .delete(`rel`)
        .with(`notification`)
        .match('(notification)-[notified:NOTIFIED]->(:User)')
        .where(`NOT (notification)-[:NOTIFICATION]->()`)
        .delete(`notification, notified`)
        .end({userId, contactId}).getCommand()
};

let removePersonFromTrustCircle = async function (userId, contactId) {
    let commands = [];

    commands.push(db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contactId}})')
        .delete('r')
        .end({userId, contactId})
        .getCommand());

    commands.push(removeUserAddedToTrustCircleNotification(userId, contactId));

    await removeInvitation(userId, contactId).send(commands);
};

module.exports = {
    addPersonToTrustCircle,
    removePersonFromTrustCircle
};
