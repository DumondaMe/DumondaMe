'use strict';

var db = require('./../../neo4j');
var cdn = require('../util/cdn');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var deletePrivacyProperties = function (privacy) {
    delete privacy.profile;
    delete privacy.profileNoContact;
    delete privacy.imageProfile;
    delete privacy.imageProfileNoContact;
};

var getContacts = function (userId, contactId, details) {
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
        .limit('6')
        .end({contactId: contactId, userId: userId})
        .send()
        .then(function (resp) {
            underscore.each(resp, function (contact) {
                if ((contact.profile || contact.profileNoContact) && (contact.imageProfile || contact.imageProfileNoContact)) {
                    contact.profileUrl = cdn.getUrl(contact.id + '/profilePreview.jpg');
                } else {
                    contact.profileUrl = cdn.getUrl('default/profilePreview.jpg');
                }
                deletePrivacyProperties(contact);
            });
            return {details: details, contacts: resp};
        });
};

var returnContactDetails = function (resp, userId, contactId) {
    var details = {name: resp[0].name, contactType: resp[0].contactType};
    if (resp[0].profile || resp[0].profileNoContact) {
        if (resp[0].imageProfile || resp[0].imageProfileNoContact) {
            details.profileUrl = cdn.getUrl(contactId + '/profile.jpg');
        } else {
            details.profileUrl = cdn.getUrl('default/profile.jpg');
        }
        if (resp[0].profileData || resp[0].profileDataNoContact) {
            details.birthday = resp[0].birthday;
            details.country = resp[0].country;
            details.place = resp[0].place;
            details.street = resp[0].street;
        }
        if (resp[0].contacts || resp[0].contactsNoContact) {
            return getContacts(userId, contactId, details);
        }
    } else {
        details.profileUrl = cdn.getUrl('default/profile.jpg');
    }
    return {details: details, contacts: []};
};

var getContactDetails = function (userId, contactId) {
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
        'contact.street AS street, isContact.type AS contactType, privacy.profile AS profile, privacy.image AS imageProfile,' +
        'privacy.profileData AS profileData, privacy.contacts AS contacts, noContactPrivacy.profile AS profileNoContact, ' +
        'noContactPrivacy.image AS imageProfileNoContact, noContactPrivacy.profileData AS profileDataNoContact, noContactPrivacy.contacts AS contactsNoContact')
        .end({userId: userId, contactId: contactId})
        .send()
        .then(function (resp) {
            return returnContactDetails(resp, userId, contactId);
        });
};


module.exports = {
    getContactDetails: getContactDetails
};
