'use strict';

const db = requireDb();
const slug = require('limax');
const commitmentSecurity = require('./../security');
const cdn = require('dumonda-me-server-lib').cdn;


const getResponse = async function (dbAdmins, userId) {
    let admins = [];
    for (let dbAdmin of dbAdmins) {
        admins.push({
            userId: dbAdmin.userId,
            name: dbAdmin.name,
            slug: slug(dbAdmin.name),
            profileUrl: await cdn.getSignedUrl(`profileImage/${dbAdmin.userId}/thumbnail.jpg`),
            isLoggedInUser: dbAdmin.userId === userId
        })
    }
    return admins;
};

const getAdmins = async function (userId, commitmentId) {
    await commitmentSecurity.isAdmin(userId, commitmentId);
    let admins = await db.cypher()
        .match(`(admin:User)-[:IS_ADMIN]->(commitment:Commitment {commitmentId: {commitmentId}})`)
        .return(`admin.userId AS userId, admin.name AS name`)
        .orderBy(`admin.name`)
        .end({commitmentId}).send();
    return {admin: await getResponse(admins, userId)};
};

module.exports = {
    getAdmins
};
