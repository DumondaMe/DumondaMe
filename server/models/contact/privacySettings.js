'use strict';

var db = require('./../../neo4j');

var getPrivacySettings = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:HAS_PRIVACY]->(:Privacy)')
        .return('r.type AS type')
        .end({
            userId: userId
        });
};

module.exports = {
    getPrivacySettings: getPrivacySettings
};
