'use strict';

var db = require('./../../neo4j');

var getContactStatistics = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .return('r.type AS type, count(*) AS count')
        .orderBy("type")
        .end({
            userId: userId
        });
};

module.exports = {
    getContactStatistics: getContactStatistics
};
