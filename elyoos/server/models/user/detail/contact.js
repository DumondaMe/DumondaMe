'use strict';

var db = requireDb();
var userInfo = require('../userInfo');
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var numberOfContacts = function (contactId) {
    return db.cypher().match('(:User {userId: {contactId}})-[:IS_CONTACT]->(:User)')
        .return('count(*) AS numberOfContacts')
        .end({contactId: contactId});
};

var numberOfSameContacts = function (userId, contactId) {
    return db.cypher().match('(:User {userId: {contactId}})-[:IS_CONTACT]->(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})')
        .return('count(*) AS numberOfSameContacts')
        .end({contactId: contactId, userId: userId});
};

var getContactsCommand = function (userId, userDetailId, contactsPerPage, skipContacts) {
    return db.cypher().match('(:User {userId: {userDetailId}})-[:IS_CONTACT]->(contactOfUser:User)')
        .with('contactOfUser')
        .match("(contactOfUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch('(contactOfUser)-[rContact:IS_CONTACT]->(:User {userId: {userId}})')
        .optionalMatch('(:User {userId: {userId}})-[isContactOfUser:IS_CONTACT]->(contactOfUser)')
        .with("rContact, isContactOfUser, contactOfUser, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('contactOfUser.name AS name, contactOfUser.userId AS userId, isContactOfUser.type AS type, ' +
            'privacy.profile AS profileVisible, privacy.image AS imageVisible')
        .orderBy('name')
        .skip('{skipContacts}')
        .limit('{contactsPerPage}')
        .end({userDetailId: userDetailId, userId: userId, contactsPerPage: contactsPerPage, skipContacts: skipContacts});
};

var allowedToGetContacts = function (userId, userDetailId, req) {
    return db.cypher().match("(userDetail:User {userId: {userDetailId}})-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch("(user:User {userId: {userId}})<-[isContact:IS_CONTACT]-(userDetail)")
        .with("isContact, privacy, vr")
        .where("(isContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (isContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return("privacy.profile AS profile, privacy.contacts AS contacts")
        .end({userId: userId, userDetailId: userDetailId})
        .send().then(function (resp) {
            if (!resp[0] || !resp[0].profile || !resp[0].contacts) {
                return exceptions.getInvalidOperation('Not allowed to view contacts of this user', logger, req);
            }
        });
};

var getContacts = function (userId, userDetailId, contactsPerPage, skipContacts, req) {
    return allowedToGetContacts(userId, userDetailId, req).then(function () {
        return getContactsCommand(userId, userDetailId, contactsPerPage, skipContacts)
            .send().then(function (resp) {
                userInfo.setUserImageVisible(userId, resp);
                userInfo.addImageForPreview(resp);
                return {users: resp};
            });
    });
};


module.exports = {
    numberOfContacts: numberOfContacts,
    numberOfSameContacts: numberOfSameContacts,
    getContactsCommand: getContactsCommand,
    getContacts: getContacts
};
