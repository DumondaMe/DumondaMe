'use strict';

var db = require('./../../../neo4j');
var userInfo = require('../userInfo');

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

var getContacts = function (userId, contactId, contactsPerPage, skipContacts) {
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
                numberOfContacts: resp[0][0].numberOfContacts,
                numberOfSameContacts: resp[1][0].numberOfSameContacts,
                contacts: resp[2]
            };
        });
};


module.exports = {
    getContacts:  getContacts
};
