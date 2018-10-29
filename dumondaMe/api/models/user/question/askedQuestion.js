'use strict';

const db = requireDb();

const hasAskedQuestion = async function (userId) {
    let response = await db.cypher().match(`(user:User {userId: {userId}})`)
        .optionalMatch(`(user)-[:IS_CREATOR]->(question:Question)`)
        .return(`count(question) AS numberOfQuestion`)
        .end({userId}).send();
    return {askedQuestion: response[0].numberOfQuestion > 0};
};

module.exports = {
    hasAskedQuestion
};
