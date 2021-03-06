/*
'use strict';

let db = requireDb();
let userInfo = require('./../user/userInfo');
let contactStatistic = require('./contactStatistic');
let privacySettings = require('./privacySettings');

let getContactingStatistics = function (userId) {
    return db.cypher().match('(:User {userId: {userId}})<-[:IS_CONTACT]-(:User)')
        .return('count(*) AS count')
        .end({userId: userId});
};

let getContacting = function (params) {
    return db.cypher().match("(user:User {userId: {userId}})<-[rContact:IS_CONTACT]-(contact:User)")
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

let getContactingNormal = function (userId, itemsPerPage, skip) {

    let commands = [];

    commands.push(getContacting({
        userId: userId,
        itemsPerPage: itemsPerPage,
        skip: skip
    }).getCommand());

    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());
    commands.push(privacySettings.getPrivacySettings(userId).getCommand());

    return getContactingStatistics(userId)
        .send(commands)
        .then(function (resp) {
            userInfo.addContactPreviewInfos(resp[0]);
            let data = {};
            data.contactingUsers = resp[0];
            data.statistic = resp[1];
            data.privacySettings = resp[2];
            data.numberOfAllContactings = resp[3][0].count;
            return data;
        });
};


module.exports = {
    getContacting: getContactingNormal,
    getContactingStatistics: getContactingStatistics
};
*/
