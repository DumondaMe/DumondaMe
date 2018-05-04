'use strict';

const db = requireDb();
const filter = require('./filter');

const getTotalNumberOfFeedElements = function (timestamp, typeFilter) {
    return db.cypher().match(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .where(`feedElement.created < {timestamp} AND ${filter.getTypeFilter(typeFilter)}`)
        .return(`count(*) AS numberOfElements`)
        .end({timestamp}).getCommand();
};

module.exports = {
    getTotalNumberOfFeedElements
};
