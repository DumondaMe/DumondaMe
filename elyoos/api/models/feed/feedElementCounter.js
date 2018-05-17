'use strict';

const db = requireDb();
const filter = require('./filter');

const getTotalNumberOfFeedElements = function (timestamp, typeFilter, language) {
    return db.cypher().match(`(feedElement)<-[:IS_CREATOR]-(creator:User)`)
        .where(`feedElement.created < {timestamp} AND ${filter.getTypeFilter(typeFilter, language)}`)
        .return(`count(*) AS numberOfElements`)
        .end({timestamp}).getCommand();
};

module.exports = {
    getTotalNumberOfFeedElements
};
