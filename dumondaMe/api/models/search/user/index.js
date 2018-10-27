'use strict';

const moreSearchResult = require('../../util/moreSearchResults');
const usersResponse = require('./response');
const db = requireDb();

const searchCommand = function (query, language, userId, skip, limit) {
    let queryString = `+User.name:${query}~`;
    return db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS user`)
        .where(`({userId} IS NULL AND user.privacyMode = 'public') OR {userId} IS NOT NULL `)
        .return(`DISTINCT user, EXISTS((user)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isTrustUser,
                 EXISTS((user)-[:IS_CONTACT]->(:User {userId: {userId}})) AS userTrustLoggedInUser`)
        .orderBy(`isTrustUser DESC, user.name`)
        .skip(`{skip}`).limit(`{limit}`).end({queryString, userId, skip, limit});
};

const search = async function (query, language, userId, skip, limit) {
    let users = await searchCommand(query, language, userId, skip, limit + 1).send();
    let hasMoreUsers = moreSearchResult.getHasMoreResults(users, limit);
    return {users: await usersResponse.getResponse(users), hasMoreUsers};
};

module.exports = {
    searchCommand,
    search
};
