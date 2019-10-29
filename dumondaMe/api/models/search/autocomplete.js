'use strict';

const db = requireDb();
const queryParser = require('./queryParser');

const search = async function (query, userId) {
    query = queryParser.cleanQuery(query);
    query = `${queryParser.proximityMatchingQuery(query.trim(), '(')} ${queryParser.wordsQuery(query, '')}`;
    let result = await db.cypher().call(`apoc.index.search("entities", {query}) YIELD node AS result, weight`)
        .where(`{userId} IS NOT NULL OR result:Commitment OR result:Question OR 
                ({userId} IS NULL AND result:User AND result.privacyMode = 'public')`)
        .unwind(`[result.title, result.name, result.question] AS property`)
        .with(`property, weight`)
        .where(`property IS NOT NULL`)
        .return(`DISTINCT property, max(weight) AS maxWeight`)
        .orderBy(`maxWeight DESC`).limit(`7`).end({query, userId}).send();
    return result.map(x => x.property)
};

module.exports = {
    search
};
