'use strict';

const db = requireDb();
const anonymousUser = require('../watches/anonymousUser');
const response = require('../watches/response');
const moreUser = require('../util/moreSearchResults');

const PAGE_SIZE = 20;

const getNumberOfCommitmentCommand = function (commitmentId, userId) {
    return db.cypher()
        .match(`(c:Commitment {commitmentId: {commitmentId}})`)
        .optionalMatch(`(c)<-[watch:WATCH]-(user:User)`)
        .where(`NOT user.userId = {userId} OR {userId} IS null`)
        .return(`COUNT(watch) AS numberOfWatches`)
        .end({commitmentId, userId}).getCommand();
};

const getUserWatchesCommitment = async function (userId, commitmentId, page) {
    page = PAGE_SIZE * page;
    let dbResponse = await db.cypher().match(`(:Commitment {commitmentId: {commitmentId}})<-[watch:WATCH]-(user:User)`)
        .where(`(user.privacyMode = 'public' OR (user.privacyMode = 'publicEl' AND {userId} IS NOT null) OR 
                (user.privacyMode = 'contactOnly' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))) AND
                (NOT user.userId = {userId} OR {userId} IS null)`)
        .return(`user.userId AS userId, user.name AS name, watch.created AS date,
                 exists((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isPersonOfTrust`)
        .orderBy(`isPersonOfTrust DESC, date DESC`)
        .skip(`{page}`)
        .limit(`${PAGE_SIZE + 1}`)
        .end({commitmentId, page, userId}).send([getNumberOfCommitmentCommand(commitmentId, userId)]);

    let hasMoreUsers = moreUser.getHasMoreResults(dbResponse[1], PAGE_SIZE);
    let users = await response.getUserResponse(dbResponse[1]);
    await anonymousUser.addAnonymousUser(users, dbResponse[0][0].numberOfWatches, hasMoreUsers, page);
    return {users, hasMoreUsers};

};

module.exports = {
    getUserWatchesCommitment
};
