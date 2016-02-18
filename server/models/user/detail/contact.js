'use strict';

var db = require('./../../../neo4j');
var userInfo = require('../userInfo');
var _ = require('lodash');

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

var setUserImageVisible = function (userId, contacts) {
    _.each(contacts, function (contact) {
        if (contact.userId === userId) {
            contact.profileVisible = true;
            contact.imageVisible = true;
        }
    })
};

var getContacts = function (userId, userDetailId, contactsPerPage, skipContacts) {
    var commands = [];

    commands.push(numberOfContacts(userDetailId).getCommand());
    commands.push(numberOfSameContacts(userId, userDetailId).getCommand());

    return db.cypher().match('(:User {userId: {userDetailId}})-[:IS_CONTACT]->(contactOfUser:User)')
        .with('contactOfUser')
        .match("(contactOfUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch('(contactOfUser)-[rContact:IS_CONTACT]->(:User {userId: {userId}})')
        .with("rContact, contactOfUser, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('contactOfUser.name AS name, contactOfUser.userId AS userId, privacy.profile AS profileVisible, privacy.image AS imageVisible')
        .orderBy('name')
        .skip('{skipContacts}')
        .limit('{contactsPerPage}')
        .end({userDetailId: userDetailId, userId: userId, contactsPerPage: contactsPerPage, skipContacts: skipContacts})
        .send(commands)
        .then(function (resp) {
            userInfo.addImageForPreview(resp[2]);
            setUserImageVisible(userId, resp[2]);
            return {
                numberOfContacts: resp[0][0].numberOfContacts,
                numberOfSameContacts: resp[1][0].numberOfSameContacts,
                contacts: resp[2]
            };
        });
};


module.exports = {
    getContacts: getContacts
};
