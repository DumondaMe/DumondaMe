'use strict';

let db = requireDb();

let getTotalNumberOfContacts = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[:IS_CONTACT]->(:User)')
        .return('count(*) AS numberOfContacts')
        .end({userId: userId});
};

let getTotalNumberOfContactsPerType = function (userId, types) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .where('r.type IN {types}')
        .return('count(*) AS numberOfContacts')
        .end({userId: userId, types: types});
};

let getContactStatisticsCommand = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .return('r.type AS group, count(*) AS count')
        .union()
        .match('(u:User {userId: {userId}})-[privacy:HAS_PRIVACY]->(:Privacy)')
        .where('NOT (u)-[:IS_CONTACT {type: privacy.type}]->(:User)')
        .return('privacy.type AS group, 0 AS count')
        .orderBy("count DESC, group")
        .end({userId: userId});
};

let getContactStatistics = function (userId) {
    return getContactStatisticsCommand(userId)
        .send([getTotalNumberOfContacts(userId).getCommand()]).then(function (resp) {
            return {numberOfContacts: resp[0][0].numberOfContacts, statistic: resp[1]};
        });
};

module.exports = {
    getContactStatisticsCommand: getContactStatisticsCommand,
    getContactStatistics: getContactStatistics,
    getTotalNumberOfContacts: getTotalNumberOfContacts,
    getTotalNumberOfContactsPerType: getTotalNumberOfContactsPerType
};
