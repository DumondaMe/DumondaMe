'use strict';

const db = requireDb();

const search = async function (query) {
    query = `${query}~`;
    let result = await db.cypher().call(`apoc.index.search("entities", {query}) YIELD node AS result`)
        .unwind(`[result.title, result.name, result.question] AS property`)
        .with(`property`)
        .where(`property IS NOT NULL`)
        .return(`DISTINCT property`)
        .limit(`7`).end({query}).send();
    return result.map(x => x.property)
};

module.exports = {
    search
};
