'use strict';

const filter = require('./filter');
const db = requireDb();

const getTotalNumberOfFeedElements = function (userId, timestamp, typeFilter) {
    return db.cypher()
        .match(`(user:User {userId: {userId}})-[relWatch:WATCH|IS_CONTACT]->(watch)
                -[relAction:UP_VOTE|:WATCH|:IS_CREATOR|:ANSWER|:EVENT]->(feedElement)`)
        .where(filter.getTypeFilter(typeFilter) + ` AND NOT ((type(relAction) = 'IS_CREATOR' OR 
                 type(relAction) = 'UP_VOTE') AND type(relWatch) = 'IS_CONTACT' AND 
                 (user)-[:WATCH]->(:Question)-[:ANSWER]->(feedElement))`)
        .return(`count(*) AS numberOfElements`)
        .end({userId, timestamp}).getCommand();
};

module.exports = {
    getTotalNumberOfFeedElements
};
