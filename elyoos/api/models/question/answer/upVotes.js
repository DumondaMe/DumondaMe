'use strict';

const db = requireDb();
const slug = require('limax');
const cdn = require('elyoos-server-lib').cdn;

const PAGE_SIZE = 20;

const getUserResponse = async function (users) {
    for (let user of users) {
        user.slug = slug(user.name);
        user.profileUrl = await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`)
    }
    if (users.length > PAGE_SIZE) {
        users.pop();
    }
    return users;
};

const getUpVotes = async function (userId, answerId, page) {
    page = PAGE_SIZE * page;
    let response = await db.cypher().match(`(:Answer {answerId: {answerId}})<-[upVote:UP_VOTE]-(user:User)`)
        .where(`(user.privacyMode = 'public' OR (user.privacyMode = 'publicEl' AND {userId} IS NOT null) OR 
                (user.privacyMode = 'contactOnly' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))) AND
                (NOT user.userId = {userId} OR {userId} IS null)`)
        .return(`user.userId AS userId, user.name AS name, upVote.created AS date,
                 exists((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isPersonOfTrust`)
        .orderBy(`isPersonOfTrust DESC, date DESC`)
        .skip(`{page}`)
        .limit(`${PAGE_SIZE + 1}`)
        .end({answerId, page, userId}).send();

    let hasMoreUsers = response.length > PAGE_SIZE;
    return {users: await getUserResponse(response), hasMoreUsers};

};

module.exports = {
    getUpVotes
};
