'use strict';

const db = requireDb();

const searchCommand = function (query, language, userId, skip, limit) {
    let queryString = `+Commitment.title:${query}~`;
    return db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS commitment`)
        .optionalMatch(`(commitment)<-[:WATCH]-(watchingUser:User)`)
        .optionalMatch(`(commitment)-[:BELONGS_TO_REGION]->(r:Region)`)
        .return(`DISTINCT commitment, COUNT(DISTINCT watchingUser) AS numberOfWatches,
                 COLLECT(DISTINCT r.${language}) AS regions,
                 EXISTS((commitment)<-[:WATCH]-(:User {userId: {userId}})) AS isWatchedByUser,
                 EXISTS((commitment)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin`)
        .skip(`{skip}`).limit(`{limit}`).end({queryString, userId, skip, limit});
};

const search = async function () {

};

module.exports = {
    searchCommand,
    search
};
