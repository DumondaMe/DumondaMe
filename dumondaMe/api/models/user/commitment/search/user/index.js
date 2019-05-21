'use strict';

const moreSearchResult = require('../../../../util/moreSearchResults');
const usersResponse = require('./response');
const queryParser = require('../../../../search/queryParser');
const security = require('./../../security');
const db = requireDb();

const searchCommand = function (query, commitmentId, userId, skip, limit) {
    query = queryParser.cleanQuery(query);
    let queryString = `User.name:("${query.trim()}"~20)^5 ${queryParser.wordsQuery(query, 'User.name:')}`;
    return db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS user, weight`)
        .where(`(user.privacyMode = 'public' OR user.privacyMode = 'publicEl' OR 
                (user.privacyMode = 'onlyContact' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}})))
                AND NOT user.userId = {userId}`)
        .return(`DISTINCT user, EXISTS((user)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isTrustUser,
                 EXISTS((user)-[:IS_ADMIN]->(:Commitment {commitmentId: {commitmentId}})) AS isAdminOfCommitment,
                 EXISTS((user)<-[:NOTIFIED]-(:Notification:Unread {type: 'requestAdminOfCommitment'})
                 -[:NOTIFICATION]->(:Commitment {commitmentId: {commitmentId}})) AS isRequestAdminOfCommitmentActive, 
                 weight`)
        .orderBy(`isTrustUser DESC, weight DESC, user.name`)
        .skip(`{skip}`).limit(`{limit}`).end({queryString, commitmentId, userId, skip, limit});
};

const search = async function (query, commitmentId, userId, skip, limit) {
    await security.isAdmin(userId, commitmentId);
    let users = await searchCommand(query, commitmentId, userId, skip, limit + 1).send();
    let hasMoreUsers = moreSearchResult.getHasMoreResults(users, limit);
    return {users: await usersResponse.getResponse(users), hasMoreUsers};
};

module.exports = {
    searchCommand,
    search
};
