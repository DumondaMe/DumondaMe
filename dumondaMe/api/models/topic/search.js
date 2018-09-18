'use strict';

const db = requireDb();

const getQueryString = function (query) {
    let queryString = '';
    for (let word of query.trim().split(' ')) {
        queryString += `${word}*~ ${word}~ `
    }
    return queryString.trim();
};

const search = async function (query) {
    let queryString = getQueryString(query);

    let result = await db.cypher().call(`apoc.index.search("keywords", {queryString}) YIELD node, weight`)
        .optionalMatch(`(node)<-[:TOPIC]-(ref)`)
        .return(`node.name AS topic, weight, COUNT(ref) AS numberOfRef`)
        .orderBy(`weight DESC, numberOfRef DESC`)
        .limit(`10`).end({queryString}).send();
    return {topics: result.map(topic => topic.topic)};
};

module.exports = {
    search
};
