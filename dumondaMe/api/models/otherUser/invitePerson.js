"use strict";

let db = requireDb();
let _ = require('lodash');

const inviteUser = async function (emails, userId) {
    await db.cypher().unwind(`{emails} AS email`)
        .merge(`(invitedUser:InvitedUser {emailNormalized: email})`)
        .onCreate(`SET invitedUser.email = email, invitedUser:EMailNotificationEnabled`)
        .with(`invitedUser`)
        .where(`invitedUser:EMailNotificationEnabled`)
        .match(`(user:User {userId: {userId}})`)
        .where(`NOT (user)-[:HAS_INVITED]->(invitedUser)`)
        .merge(`(user)-[:HAS_INVITED]->(invitedUser)`)
        .merge(`(user)-[:SENDING_EMAIL_PENDING]->(invitedUser)`)
        .end({emails, userId}).send();
};

const getNotExistingUsers = async function (emails) {
    let existingUsers = await db.cypher().match(`(user:User)`)
        .where(`user.emailNormalized IN {emails}`)
        .return(`user.emailNormalized AS emailNormalized`)
        .end({emails}).send();
    return _.difference(emails, existingUsers.map((user) => user.emailNormalized));
};

const setInvitationFlag = async function (userId, emails) {
    let usersToInvite = await getNotExistingUsers(emails);
    await inviteUser(usersToInvite, userId);
};

module.exports = {
    setInvitationFlag
};
