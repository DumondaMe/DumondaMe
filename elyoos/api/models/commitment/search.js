'use strict';

const db = requireDb();

const getQueryString = function (query) {
    let queryString = '';
    for (let word of query.trim().split(' ')) {
        if (word.trim().length > 0) {
            queryString += `Commitment.title:${word}*~ `;
        }
    }
    return queryString.trim();
};

const search = async function (query) {
    let queryString = getQueryString(query);

    let result = await db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node, weight`)
        .return(`node.title AS title`)
        .limit(`10`).end({queryString}).send();
    return {commitments: result.map(commitment => commitment.title)};
};

module.exports = {
    search
};
