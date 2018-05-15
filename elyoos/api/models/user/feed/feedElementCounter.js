'use strict';

const db = requireDb();

const getTotalNumberOfFeedElements = function (userId, timestamp, typeFilter) {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[:WATCH|IS_CONTACT]->(watch)
                -[rel:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER]->(feedElement)`)
        .where(`(watch:User OR watch:Question OR watch:Commitment) AND 
                (feedElement:Answer OR feedElement:Commitment OR feedElement:Question)`)
        .return(`count(*) AS numberOfElements`)
        .end({userId, timestamp}).getCommand();
};

module.exports = {
    getTotalNumberOfFeedElements
};
