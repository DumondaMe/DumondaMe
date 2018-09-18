'use strict';

const db = requireDb();
const anonymousUser = require('../watches/anonymousUser');
const response = require('../watches/response');
const moreUser = require('../util/moreSearchResults');

const PAGE_SIZE = 20;

const getNumberOfWatchesCommand = function (questionId, userId) {
    return db.cypher()
        .match(`(q:Question {questionId: {questionId}})`)
        .optionalMatch(`(q)<-[watch:WATCH]-(user:User)`)
        .where(`NOT user.userId = {userId} OR {userId} IS null`)
        .return(`COUNT(watch) AS numberOfWatches`)
        .end({questionId, userId}).getCommand();
};

const getUserWatchesQuestion = async function (userId, questionId, page) {
    page = PAGE_SIZE * page;
    let dbResponse = await db.cypher().match(`(:Question {questionId: {questionId}})<-[watch:WATCH]-(user:User)`)
        .where(`(user.privacyMode = 'public' OR (user.privacyMode = 'publicEl' AND {userId} IS NOT null) OR 
                (user.privacyMode = 'contactOnly' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))) AND
                (NOT user.userId = {userId} OR {userId} IS null)`)
        .return(`user.userId AS userId, user.name AS name, watch.created AS date,
                 exists((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isPersonOfTrust`)
        .orderBy(`isPersonOfTrust DESC, date DESC`)
        .skip(`{page}`)
        .limit(`${PAGE_SIZE + 1}`)
        .end({questionId, page, userId}).send([getNumberOfWatchesCommand(questionId, userId)]);

    let hasMoreUsers = moreUser.getHasMoreResults(dbResponse[1], PAGE_SIZE);
    let users = await response.getUserResponse(dbResponse[1]);
    await anonymousUser.addAnonymousUser(users, dbResponse[0][0].numberOfWatches, hasMoreUsers, page);
    return {users, hasMoreUsers};

};

module.exports = {
    getUserWatchesQuestion
};
