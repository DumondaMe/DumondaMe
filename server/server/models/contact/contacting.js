'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../../common/src/lib/error/exceptions');
var underscore = require('underscore');
var Promise = require('bluebird').Promise;
var logger = requireLogger.getLogger(__filename);
var moment = require('moment');
var userInfo = require('./../user/userInfo');

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
        .return("r.type AS type, rContact.type AS contactType, rContact.contactAdded AS userAdded, contact.name AS name, contact.userId AS id, " +
        "v.profile AS profileVisible, v.image AS imageVisible")
        .end(params);
};

var getContactingNormal = function (userId, itemsPerPage, skip, expires) {

    var commands = [];

    commands.push(getContacting({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip
    }, "user.userId = {userId}").getCommand());

    return getContactingStatistics(userId)
        .send(commands)
        .then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0], expires);
            return resp;
        });
};


module.exports = {
    getContacting: getContactingNormal
};
