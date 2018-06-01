'use strict';

const db = requireDb();
const filter = require('./filter');

const getTotalNumberOfFeedElements = function (timestamp, typeFilter, language) {
    return db.cypher().match(`(feedElement)<-[:IS_CREATOR|:EVENT]-(creator)`)
        .where(`feedElement.created < {timestamp} AND (creator:User OR creator:Commitment) AND 
                ${filter.getTypeFilter(typeFilter, language)}`)
        .return(`count(*) AS numberOfElements`)
        .end({timestamp}).getCommand();
};

module.exports = {
    getTotalNumberOfFeedElements
};
