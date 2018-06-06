/*
'use strict';

let db = requireDb();

let getTotalNumberOfPersonOfTrusts = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[:IS_CONTACT]->(:User)')
        .return('count(*) AS numberOfPersonOfTrusts')
        .end({userId: userId});
};

let getPersonOfTrustStatisticsCommand = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .return('r.type AS group, count(*) AS count')
        .union()
        .match('(u:User {userId: {userId}})-[privacy:HAS_PRIVACY]->(:Privacy)')
        .where('NOT (u)-[:IS_CONTACT {type: privacy.type}]->(:User)')
        .return('privacy.type AS group, 0 AS count')
        .orderBy("count DESC, group")
        .end({userId: userId});
};

let getPersonOfTrustStatistics = function (userId) {
    return getPersonOfTrustStatisticsCommand(userId)
        .send([getTotalNumberOfPersonOfTrusts(userId).getCommand()]).then(function (resp) {
            return {numberOfPersonOfTrusts: resp[0][0].numberOfPersonOfTrusts, statistic: resp[1]};
        });
};

module.exports = {
    getPersonOfTrustStatisticsCommand,
    getPersonOfTrustStatistics,
    getTotalNumberOfPersonOfTrusts
};
*/
