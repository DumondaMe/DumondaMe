'use strict';

var db = requireDb();

var getPrivacySettings = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:HAS_PRIVACY]->(:Privacy)')
        .return('r.type AS type')
        .orderBy("type")
        .end({
            userId: userId
        });
};

module.exports = {
    getPrivacySettings: getPrivacySettings
};
