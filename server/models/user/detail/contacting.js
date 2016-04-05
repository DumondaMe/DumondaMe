'use strict';

var db = require('./../../../neo4j');
var userInfo = require('../userInfo');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var numberOfContacting = function (contactId) {
    return db.cypher().match('(:User {userId: {contactId}})<-[:IS_CONTACT]-(:User)')
        .return('count(*) AS numberOfContacting')
        .end({contactId: contactId});
};

var getContactingCommand = function (userId, userDetailId, contactsPerPage, skipContacts) {

    return db.cypher().match('(:User {userId: {userDetailId}})<-[:IS_CONTACT]-(contactingOfUser:User)')
        .with('contactingOfUser')
        .match("(contactingOfUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch('(contactingOfUser)-[rContact:IS_CONTACT]->(user:User {userId: {userId}})')
        .optionalMatch('(user)-[isContactOfUser:IS_CONTACT]->(contactingOfUser)')
        .with("rContact, contactingOfUser, isContactOfUser, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('contactingOfUser.name AS name, contactingOfUser.userId AS userId, isContactOfUser.type AS type, ' +
            'privacy.profile AS profileVisible, privacy.image AS imageVisible')
        .orderBy('name')
        .skip('{skipContacts}')
        .limit('{contactsPerPage}')
        .end({userDetailId: userDetailId, userId: userId, contactsPerPage: contactsPerPage, skipContacts: skipContacts});
};

var allowedToGetContactings = function (userId, userDetailId, req) {
    return db.cypher().match("(userDetail:User {userId: {userDetailId}})-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user:User {userId: {userId}})<-[isContact:IS_CONTACT]-(userDetail)")
        .with("isContact, privacy, vr")
        .where("(isContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (isContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("privacy.profile AS profile, privacy.contacts AS contacts")
        .end({userId: userId, userDetailId: userDetailId})
        .send().then(function (resp) {
            if (!resp[0] || !resp[0].profile || !resp[0].contacts) {
                return exceptions.getInvalidOperation('Not allowed to view contacting of this user', logger, req);
            }
        });
};

var getContacting = function (userId, userDetailId, contactsPerPage, skipContacts, req) {
    return allowedToGetContactings(userId, userDetailId, req).then(function () {
        return getContactingCommand(userId, userDetailId, contactsPerPage, skipContacts)
            .send().then(function (resp) {
                userInfo.setUserImageVisible(userId, resp);
                userInfo.addImageForPreview(resp);
                return {users: resp};
            });
    });
};

module.exports = {
    numberOfContacting: numberOfContacting,
    getContactingCommand: getContactingCommand,
    getContacting: getContacting
};
