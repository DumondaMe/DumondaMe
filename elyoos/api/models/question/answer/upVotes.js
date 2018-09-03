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
    return users;
};

const getTotalNumberOfUpVotesCommand = function (answerId) {
    return db.cypher().match(`(:Answer {answerId: {answerId}})<-[:UP_VOTE]-(:User)`)
        .return(`count(*) AS numberOfUpVotes`).end({answerId}).getCommand();
};

const getTotalNumberOfTrustUserCommand = function (answerId, userId) {
    return db.cypher().match(`(:Answer {answerId: {answerId}})<-[:UP_VOTE]-(:User)
                      <-[:IS_CONTACT]-(:User {userId: {userId}})`)
        .return(`count(*) AS numberOfUpVotes`).end({answerId, userId}).getCommand();
};

const getTotalNumberOfInvisibleUserCommand = function (answerId, userId) {
    return db.cypher().match(`(:Answer {answerId: {answerId}})<-[:UP_VOTE]-(user:User)`)
        .where(`(user.privacyMode = 'publicEl' AND {userId} IS null) OR (user.privacyMode = 'contactOnly' AND 
        ({userId} IS null OR NOT (user)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return(`count(*) AS numberOfUpVotes`).end({answerId, userId}).getCommand();
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
        .limit(`${PAGE_SIZE}`)
        .end({answerId, page, userId})
        .send([getTotalNumberOfUpVotesCommand(answerId),
            getTotalNumberOfTrustUserCommand(answerId, userId),
            getTotalNumberOfInvisibleUserCommand(answerId, userId)]);
    return {
        users: await getUserResponse(response[3]), numberOfUsers: response[0][0].numberOfUpVotes,
        numberOfTrustUsers: response[1][0].numberOfUpVotes, numberOfInvisibleUsers: response[2][0].numberOfUpVotes
    };

};

module.exports = {
    getUpVotes
};
