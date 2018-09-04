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

const getUserWatchesQuestion = async function (userId, questionId, page) {
    page = PAGE_SIZE * page;
    let response = await db.cypher().match(`(:Question {questionId: {questionId}})<-[watch:WATCH]-(user:User)`)
        .where(`(user.privacyMode = 'public' OR (user.privacyMode = 'publicEl' AND {userId} IS NOT null) OR 
                (user.privacyMode = 'contactOnly' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))) AND
                (NOT user.userId = {userId} OR {userId} IS null)`)
        .return(`user.userId AS userId, user.name AS name, watch.created AS date,
                 exists((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isPersonOfTrust`)
        .orderBy(`isPersonOfTrust DESC, date DESC`)
        .skip(`{page}`)
        .limit(`${PAGE_SIZE + 1}`)
        .end({questionId, page, userId}).send();

    let hasMoreUsers = response.length > PAGE_SIZE;
    return {users: await getUserResponse(response), hasMoreUsers};

};

module.exports = {
    getUserWatchesQuestion
};
