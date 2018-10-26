'use strict';

const db = requireDb();

const search = async function (query, userId) {
    query = `${query}~`;
    let result = await db.cypher().call(`apoc.index.search("entities", {query}) YIELD node AS result`)
        .where(`{userId} IS NOT NULL OR result:Commitment OR result:Question OR 
                ({userId} IS NULL AND result:User AND result.privacyMode = 'public')`)
        .unwind(`[result.title, result.name, result.question] AS property`)
        .with(`property`)
        .where(`property IS NOT NULL`)
        .return(`DISTINCT property`)
        .limit(`7`).end({query, userId}).send();
    return result.map(x => x.property)
};

module.exports = {
    search
};
