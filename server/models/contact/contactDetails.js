'use strict';

var db = require('./../../neo4j');
var cdn = require('../util/cdn');
var contactStatistic = require('./contactStatistic');
var privacySettings = require('./privacySettings');
var userInfo = require('../user/userInfo');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

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

var getContacts = function (userId, contactId, contactsPerPage, skipContacts, contactDetails, statistic, privacySettingsOfUser) {
    var commands = [];

    commands.push(numberOfContacts(contactId).getCommand());
    commands.push(numberOfSameContacts(userId, contactId).getCommand());

    return db.cypher().match('(contact:User {userId: {contactId}})-[:IS_CONTACT]->(contactOfContact:User)')
        .with('contact, contactOfContact')
        .where("contactOfContact.userId <> {userId}")
        .with('contact, contactOfContact')
        .match("(contactOfContact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch('(contactOfContact)-[rContact:IS_CONTACT]->(:User {userId: {userId}})')
        .with("contact, rContact, contactOfContact, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('contactOfContact.name AS name, contactOfContact.userId AS userId, privacy.profile AS profileVisible, privacy.image AS imageVisible')
        .orderBy('name')
        .skip('{skipContacts}')
        .limit('{contactsPerPage}')
        .end({contactId: contactId, userId: userId, contactsPerPage: contactsPerPage, skipContacts: skipContacts})
        .send(commands)
        .then(function (resp) {
            userInfo.addImageForPreview(resp[2]);
            return {
                contact: contactDetails,
                numberOfContacts: resp[0][0].numberOfContacts,
                numberOfSameContacts: resp[1][0].numberOfSameContacts,
                statistic: statistic,
                privacySettings: privacySettingsOfUser,
                contacts: resp[2]
            };
        });
};

var returnContactDetails = function (resp, userId, contactId, contactsPerPage, skipContacts, req) {
    var contact = {
        name: resp[2][0].name,
        female: resp[2][0].female,
        type: resp[2][0].type,
        contactAdded: resp[2][0].contactAdded,
        userAdded: resp[2][0].userAdded
    };
    userInfo.addConnectionInfo(resp[2][0]);
    contact.connected = resp[2][0].connected;

    if (resp[2][0].profileVisible) {
        if (resp[2][0].imageVisible) {
            contact.profileUrl = cdn.getUrl('profileImage/' + contactId + '/profile.jpg');
        } else {
            contact.profileUrl = cdn.getUrl('profileImage/default/profile.jpg');
        }
        if (resp[2][0].profileDataVisible) {
            contact.birthday = resp[2][0].birthday;
            contact.country = resp[2][0].country;
            contact.place = resp[2][0].place;
            contact.street = resp[2][0].street;
        }
        if (resp[2][0].contactsVisible) {
            logger.debug('Get detail of user ' + contactId + ' with contacts', req);
            return getContacts(userId, contactId, contactsPerPage, skipContacts, contact, resp[0], resp[1]);
        }
    } else {
        contact.profileUrl = cdn.getUrl('profileImage/default/profile.jpg');
    }
    logger.debug('Get detail of user ' + contactId + ' without contacts', req);
    return {contact: contact, contacts: [], statistic: resp[0], privacySettings: resp[1]};
};

var getContactDetails = function (userId, contactId, contactsPerPage, skipContacts, req) {

    var commands = [];

    commands.push(contactStatistic.getContactStatisticsCommand(userId).getCommand());
    commands.push(privacySettings.getPrivacySettings(userId).getCommand());

    return db.cypher().match('(contact:User {userId: {contactId}}), (user:User {userId: {userId}})')
        .optionalMatch('(user)-[isContact:IS_CONTACT]->(contact)')
        .with('user, contact, isContact')
        .match("(contact)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch('(user)<-[contactHasUserContacted:IS_CONTACT]-(contact)')
        .with("user, contact, isContact, contactHasUserContacted, privacy, vr")
        .where("(contactHasUserContacted IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR " +
        "(contactHasUserContacted.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('contact.userId AS userId, contact.name AS name, contact.birthday AS birthday, contact.country AS country, contact.place AS place, ' +
        'contact.street AS street, contact.female AS female, isContact.type AS type, contactHasUserContacted.type AS contactType, ' +
        'isContact.contactAdded AS contactAdded, contactHasUserContacted.contactAdded AS userAdded, privacy.profile AS profileVisible, ' +
        'privacy.image AS imageVisible, privacy.profileData AS profileDataVisible, privacy.contacts AS contactsVisible')
        .orderBy("name DESC")
        .end({userId: userId, contactId: contactId})
        .send(commands)
        .then(function (resp) {
            return returnContactDetails(resp, userId, contactId, contactsPerPage, skipContacts, req);
        });
};


module.exports = {
    getContactDetails: getContactDetails,
    getContacts: function (userId, contactId, contactsPerPage, skipContacts) {
        return getContacts(userId, contactId, contactsPerPage, skipContacts);
    }
};
