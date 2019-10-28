'use strict';

const moreSearchResult = require('../../util/moreSearchResults');
const usersResponse = require('./response');
const queryParser = require('../queryParser');
const db = requireDb();

const searchCommand = function (query, language, userId, skip, limit) {
    query = queryParser.cleanQuery(query);
    let queryString = `User.name:("${query.trim()}"~20)^5 ${queryParser.wordsQuery(query, 'User.name:')}`;
    return db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS user, weight`)
        .where(`user:HarvestingUser`)
        .return(`DISTINCT user, weight`)
        .orderBy(`weight DESC, user.name`)
        .skip(`{skip}`).limit(`{limit}`).end({queryString, userId, skip, limit});
};

const search = async function (query, language, userId, skip, limit) {
    let users = await searchCommand(query, language, userId, skip, limit + 1).send();
    let hasMoreHarvestingUsers = moreSearchResult.getHasMoreResults(users, limit);
    return {harvestingUsers: await usersResponse.getResponse(users, userId), hasMoreHarvestingUsers};
};

module.exports = {
    searchCommand,
    search
};
