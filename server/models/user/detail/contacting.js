'use strict';

var db = require('./../../../neo4j');

var numberOfContacting = function (contactId) {
    return db.cypher().match('(:User {userId: {contactId}})<-[:IS_CONTACT]-(:User)')
        .return('count(*) AS numberOfContacting')
        .end({contactId: contactId});
};

var getContacting = function (userId, userDetailId, contactsPerPage, skipContacts) {

    return db.cypher().match('(:User {userId: {userDetailId}})<-[:IS_CONTACT]-(contactingOfUser:User)')
        .with('contactingOfUser')
        .match("(contactingOfUser)-[vr:HAS_PRIVACY|HAS_PRIVACY_NO_CONTACT]->(privacy:Privacy)")
        .optionalMatch('(contactingOfUser)-[rContact:IS_CONTACT]->(:User {userId: {userId}})')
        .with("rContact, contactingOfUser, privacy, vr")
        .where("(rContact IS NULL AND type(vr) = 'HAS_PRIVACY_NO_CONTACT') OR (rContact.type = vr.type AND type(vr) = 'HAS_PRIVACY')")
        .return('contactingOfUser.name AS name, contactingOfUser.userId AS userId, privacy.profile AS profileVisible, privacy.image AS imageVisible')
        .orderBy('name')
        .skip('{skipContacts}')
        .limit('{contactsPerPage}')
        .end({userDetailId: userDetailId, userId: userId, contactsPerPage: contactsPerPage, skipContacts: skipContacts});
};


module.exports = {
    numberOfContacting: numberOfContacting,
    getContacting: getContacting
};
