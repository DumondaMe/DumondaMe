'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var underscore = require('underscore');
var Promise = require('bluebird').Promise;
var logger = requireLogger.getLogger(__filename);
var moment = require('moment');
var userInfo = require('./../user/userInfo');
var contactStatistic = require('./contactStatistic');
var privacySettings = require('./privacySettings');

var getContactingStatistics = function (userId) {
    var now = Math.floor(moment.utc().valueOf() / 1000);
    return db.cypher().match('(:User {userId: {userId}})<-[r:IS_CONTACT]-(:User)')
        .where('r.contactAdded > {day}')
        .return('count(*) AS count')
        .unionAll().match('(:User {userId: {userId}})<-[r:IS_CONTACT]-(:User)')
        .where('r.contactAdded > {week}')
        .return('count(*) AS count')
        .unionAll().match('(:User {userId: {userId}})<-[r:IS_CONTACT]-(:User)')
        .where('r.contactAdded > {month}')
        .return('count(*) AS count')
        .unionAll().match('(:User {userId: {userId}})<-[r:IS_CONTACT]-(:User)')
        .return('count(*) AS count')
        .end({
            userId: userId,
            day: now - 86400,
            week: now - 604800,
            month: now - 2592000
        });
};

var getContacting = function (params, where) {
    return db.cypher().match("(user:User)<-[rContact:IS_CONTACT]-(contact:User)")
        .where(where)
        .with("contact, user, rContact")
        .orderBy("rContact.contactAdded DESC")
        .skip("{skip}")
        .limit("{itemsPerPage}")
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(v:Privacy)")
        .optionalMatch("(user)-[r:IS_CONTACT]->(contact)")
        .with("contact, rContact, user, r, v, vr")
        .where("rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY'")
        .return("r.type AS type, rContact.type AS contactType, rContact.contactAdded AS userAdded, contact.name AS name, contact.userId AS userId, " +
        "v.profile AS profileVisible, v.image AS imageVisible")
        .end(params);
};

var getContactingNormal = function (userId, itemsPerPage, skip) {

    var commands = [];

    commands.push(getContacting({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip
    }, "user.userId = {userId}").getCommand());

    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());
    commands.push(privacySettings.getPrivacySettings(userId).getCommand());

    return getContactingStatistics(userId)
        .send(commands)
        .then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0]);
            var data = {};
            data.contactingUsers = resp[0];
            data.statistic = resp[1];
            data.privacySettings = resp[2];
            data.numberOfContactingLastDay = resp[3][0].count;
            data.numberOfContactingLastWeek = resp[3][1].count;
            data.numberOfContactingLastMonth = resp[3][2].count;
            data.numberOfAllContactings = resp[3][3].count;
            return data;
        });
};


module.exports = {
    getContacting: getContactingNormal
};
