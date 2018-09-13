'use strict';

const db = requireDb();
const anonymousUser = require('../../watches/anonymousUser');
const response = require('../../watches/response');
const moreUser = require('../../watches/moreUser');

const PAGE_SIZE = 20;

const getNumberOfUpVotesCommand = function (answerId, userId) {
    return db.cypher().match(`(a:Answer {answerId: {answerId}})`)
        .optionalMatch(`(a)<-[upVote:UP_VOTE]-(user:User)`)
        .where(`NOT user.userId = {userId} OR {userId} IS null`)
        .return(`COUNT(upVote) AS numberOfUpVotes`)
        .end({answerId, userId}).getCommand();
};

const getUpVotes = async function (userId, answerId, page) {
    page = PAGE_SIZE * page;
    let dbResponse = await db.cypher().match(`(:Answer {answerId: {answerId}})<-[upVote:UP_VOTE]-(user:User)`)
        .where(`(user.privacyMode = 'public' OR (user.privacyMode = 'publicEl' AND {userId} IS NOT null) OR 
                (user.privacyMode = 'contactOnly' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))) AND
                (NOT user.userId = {userId} OR {userId} IS null)`)
        .return(`user.userId AS userId, user.name AS name, upVote.created AS date,
                 exists((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isPersonOfTrust`)
        .orderBy(`isPersonOfTrust DESC, date DESC`)
        .skip(`{page}`)
        .limit(`${PAGE_SIZE + 1}`)
        .end({answerId, page, userId}).send([getNumberOfUpVotesCommand(answerId, userId)]);

    let hasMoreUsers = moreUser.getHasMoreUsers(dbResponse[1], PAGE_SIZE);
    let users = await response.getUserResponse(dbResponse[1]);
    await anonymousUser.addAnonymousUser(users, dbResponse[0][0].numberOfUpVotes, hasMoreUsers, page);
    return {users, hasMoreUsers};

};

module.exports = {
    getUpVotes
};
