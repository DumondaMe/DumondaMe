'use strict';

var db = require('./../../neo4j');
var cdn = require('../util/cdn');
var contactStatistic = require('./contactStatistic');
var privacySettings = require('./privacySettings');
var userInfo = require('../user/userInfo');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var deletePrivacyProperties = function (privacy) {
    delete privacy.profile;
    delete privacy.profileNoContact;
    delete privacy.imageProfile;
    delete privacy.imageProfileNoContact;
};

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

var getContacts = function (userId, contactId, contact, statistic, privacySettings) {
    var commands = [];

    commands.push(numberOfContacts(contactId).getCommand());
    commands.push(numberOfSameContacts(userId, contactId).getCommand());

    return db.cypher().match('(contact:User {userId: {contactId}})-[:IS_CONTACT]->(contactOfContact:User), (user:User {userId: {userId}})')
        .optionalMatch('(contactOfContact)-[isContact:IS_CONTACT]->(user)')
        .with('contact, contactOfContact, isContact')
        .where("contactOfContact.userId <> {userId}")
        .with('contact, contactOfContact, isContact')
        .optionalMatch('(contactOfContact)-[privacyRel:HAS_PRIVACY]->(privacy:Privacy)')
        .where('privacyRel.type = isContact.type')
        .with('contact, contactOfContact, isContact, privacy')
        .optionalMatch('(contactOfContact)-[:HAS_PRIVACY_NO_CONTACT]->(noContactPrivacy:Privacy)')
        .where('isContact IS NULL')
        .return('contactOfContact.name AS name, contactOfContact.userId AS id, privacy.profile AS profile, privacy.image AS imageProfile,' +
        'noContactPrivacy.profile AS profileNoContact, noContactPrivacy.image AS imageProfileNoContact')
        .limit('7')
        .end({contactId: contactId, userId: userId})
        .send(commands)
        .then(function (resp) {
            underscore.each(resp[2], function (contact) {
                if ((contact.profile || contact.profileNoContact) && (contact.imageProfile || contact.imageProfileNoContact)) {
                    contact.profileUrl = cdn.getUrl(contact.id + '/profilePreview.jpg');
                } else {
                    contact.profileUrl = cdn.getUrl('default/profilePreview.jpg');
                }
                deletePrivacyProperties(contact);
            });
            return {
                contact: contact,
                numberOfContacts: resp[0][0].numberOfContacts,
                numberOfSameContacts: resp[1][0].numberOfSameContacts,
                statistic: statistic,
                privacySettings: privacySettings,
                contacts: resp[2]
            };
        });
};

var returnContactDetails = function (resp, userId, contactId) {
    var contact = {
        name: resp[2][0].name,
        female: resp[2][0].female,
        type: resp[2][0].type,
        contactAdded: resp[2][0].contactAdded,
        userAdded: resp[2][0].userAdded
    };

    userInfo.addConnectionInfo(resp[2][0]);
    contact.connected = resp[2][0].connected;

    if (resp[2][0].profile || resp[2][0].profileNoContact) {
        if (resp[2][0].imageProfile || resp[2][0].imageProfileNoContact) {
            contact.profileUrl = cdn.getUrl(contactId + '/profile.jpg');
        } else {
            contact.profileUrl = cdn.getUrl('default/profile.jpg');
        }
        if (resp[2][0].profileData || resp[2][0].profileDataNoContact) {
            contact.birthday = resp[2][0].birthday;
            contact.country = resp[2][0].country;
            contact.place = resp[2][0].place;
            contact.street = resp[2][0].street;
        }
        if (resp[2][0].contacts || resp[2][0].contactsNoContact) {
            return getContacts(userId, contactId, contact, resp[0], resp[1]);
        }
    } else {
        contact.profileUrl = cdn.getUrl('default/profile.jpg');
    }
    return {contact: contact, contacts: [], statistic: resp[0], privacySettings: resp[1]};
};

var getContactDetails = function (userId, contactId) {

    var commands = [];

    commands.push(contactStatistic.getContactStatistics(userId).getCommand());
    commands.push(privacySettings.getPrivacySettings(userId).getCommand());

    return db.cypher().match('(contact:User {userId: {contactId}}), (user:User {userId: {userId}})')
        .optionalMatch('(user)-[isContact:IS_CONTACT]->(contact)')
        .with('user, contact, isContact')
        .optionalMatch('(user)<-[contactHasUserContacted:IS_CONTACT]-(contact)')
        .with('user, contact, isContact, contactHasUserContacted')
        .optionalMatch('(contact)-[privacyRel:HAS_PRIVACY]->(privacy:Privacy)')
        .where('privacyRel.type = contactHasUserContacted.type')
        .with('user, contact, isContact, contactHasUserContacted, privacyRel, privacy')
        .optionalMatch('(contact)-[:HAS_PRIVACY_NO_CONTACT]->(noContactPrivacy:Privacy)')
        .where('contactHasUserContacted IS NULL')
        .return('contact.name AS name, contact.birthday AS birthday, contact.country AS country, contact.place AS place, ' +
        'contact.street AS street, contact.female AS female, isContact.type AS type, contactHasUserContacted.type AS contactType, ' +
        'isContact.contactAdded AS contactAdded, contactHasUserContacted.contactAdded AS userAdded, privacy.profile AS profile, ' +
        'privacy.image AS imageProfile, privacy.profileData AS profileData, privacy.contacts AS contacts, ' +
        'noContactPrivacy.profile AS profileNoContact, noContactPrivacy.image AS imageProfileNoContact, ' +
        'noContactPrivacy.profileData AS profileDataNoContact, noContactPrivacy.contacts AS contactsNoContact')
        .end({userId: userId, contactId: contactId})
        .send(commands)
        .then(function (resp) {
            return returnContactDetails(resp, userId, contactId);
        });
};


module.exports = {
    getContactDetails: getContactDetails
};
