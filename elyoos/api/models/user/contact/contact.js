'use strict';

let db = requireDb();
let moment = require('moment');

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

let addContact = async function (userId, contactId) {
    await validAddContactCommand(userId, contactId);
    let commands = [], timeAddedContact = Math.floor(moment.utc().valueOf() / 1000);
    commands.push(db.cypher().match('(u:User {userId: {userId}}), (u2:User {userId: {contactId}})')
        .where('NOT (u)-[:IS_CONTACT]->(u2)')
        .merge('(u)-[:IS_CONTACT {contactAdded: {contactAdded}}]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_BLOCKED]->(u2)')
        .delete('r')
        .end({
            userId: userId, contactId: contactId, contactAdded: timeAddedContact
        }).getCommand());

    await removeInvitation(userId, contactId).send(commands);
    return {isContactSince: timeAddedContact};
};

let deleteContact = async function (userId, contactId) {
    let commands = [];

    commands.push(db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(u2:User {userId: {contactId}})')
        .delete('r')
        .end({userId, contactId})
        .getCommand());

    await removeInvitation(userId, contactId).send(commands);
};

let blockContact = async function (userId, blockedUserId) {
    let commands = [];
    commands.push(db.cypher().match('(u:User {userId: {userId}}), (u2:User {userId: {blockedUserId}})')
        .merge('(u)-[:IS_BLOCKED]->(u2)')
        .with('u, u2')
        .match('(u)-[r:IS_CONTACT]->(u2)')
        .delete('r')
        .end({userId, blockedUserId})
        .getCommand());

    await removeInvitation(userId, blockedUserId).send(commands);
};

let unblockContact = async function (userId, blockedUserId) {
    await db.cypher().match('(u:User {userId: {userId}})-[blocked:IS_BLOCKED]->(u2:User {userId: {blockedUserId}})')
        .delete('blocked')
        .end({userId, blockedUserId}).send();
};

module.exports = {
    addContact,
    deleteContact,
    blockContact,
    unblockContact
};
