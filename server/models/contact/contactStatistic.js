'use strict';

var db = require('./../../neo4j');
var _ = require('underscore');

var getTotalNumberOfContacts = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[:IS_CONTACT]->(:User)')
        .return('count(*) AS numberOfContacts')
        .end({
            userId: userId
        });
};

var getTotalNumberOfContactsPerType = function (userId, types) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .where('r.type IN {types}')
        .return('count(*) AS numberOfContacts')
        .end({
            userId: userId,
            types: types
        });
};

var getContactStatisticsCommand = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[r:IS_CONTACT]->(:User)')
        .return('r.type AS type, count(*) AS count')
        .orderBy("count DESC")
        .end({
            userId: userId
        });
};

var getAllContactTypesCommand = function (userId) {
    return db.cypher().match('(u:User {userId: {userId}})-[privacy:HAS_PRIVACY]->(:Privacy)')
        .return('privacy.type AS type')
        .end({
            userId: userId
        }).getCommand();
};

var addUnusedTypes = function (statistic, allTypes) {
    _.each(allTypes, function (type) {
        if (!_.findWhere(statistic, type)) {
            statistic.push({type: type.type, count: 0});
        }
    });
    return statistic;
};

var getContactStatistics = function (userId) {
    return getContactStatisticsCommand(userId)
        .send([getTotalNumberOfContacts(userId).getCommand(), getAllContactTypesCommand(userId)]).then(function (resp) {
            return {numberOfContacts: resp[0][0].numberOfContacts, statistic: addUnusedTypes(resp[2], resp[1])};
        });
};

module.exports = {
    getContactStatisticsCommand: getContactStatisticsCommand,
    getContactStatistics: getContactStatistics,
    getTotalNumberOfContacts: getTotalNumberOfContacts,
    getTotalNumberOfContactsPerType: getTotalNumberOfContactsPerType
};
