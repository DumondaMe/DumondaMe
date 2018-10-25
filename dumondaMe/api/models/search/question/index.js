'use strict';

const db = requireDb();

const searchCommand = function (query, language, userId, skip, limit) {
    let queryString = `+Question.question:${query}~`;
    return db.cypher().call(`apoc.index.search("entities", {queryString}) YIELD node AS question`)
        .match(`(question)<-[:IS_CREATOR]-(admin:User)`)
        .optionalMatch(`(question)<-[:WATCH]-(watchingUser:User)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer:Answer)`)
        .return(`DISTINCT question, admin, COUNT(DISTINCT watchingUser) AS numberOfWatches,
                 COUNT(DISTINCT answer) AS numberOfAnswers,
                 EXISTS((question)<-[:WATCH]-(:User {userId: {userId}})) AS isWatchedByUser,
                 EXISTS((question)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin,
                 EXISTS((admin)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isTrustUser`)
        .skip(`{skip}`).limit(`{limit}`).end({queryString, userId, skip, limit});
};

const search = async function () {

};

module.exports = {
    searchCommand,
    search
};
