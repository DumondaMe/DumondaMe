'use strict';

const db = requireDb();

let removeInvitation = function (userId, contactId) {
    return db.cypher().match('(u:User {userId: {userId}})<-[invitedRel:HAS_INVITED]-(u2:User {userId: {contactId}})')
        .delete('invitedRel')
        .end({userId, contactId});
};

let blockOtherUser = async function (userId, blockedUserId) {
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

let unblockOtherUser = async function (userId, blockedUserId) {
    await db.cypher().match('(u:User {userId: {userId}})-[blocked:IS_BLOCKED]->(u2:User {userId: {blockedUserId}})')
        .delete('blocked')
        .end({userId, blockedUserId}).send();
};

module.exports = {
    blockOtherUser,
    unblockOtherUser
};
