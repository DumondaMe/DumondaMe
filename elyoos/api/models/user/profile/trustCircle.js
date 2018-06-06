'use strict';

let db = requireDb();
let userInfo = require('../userInfo');

let getPeopleOfTrustWithPrivacyCommand = function (invisible) {
    invisible = invisible ? 'NOT' : '';
    return db.cypher().match(`(user:User {userId: {userDetailId}})`)
        .where(`user.privacyMode = 'public' OR user.userId = {userId} OR 
               (user.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR
               (user.privacyMode = 'onlyContact' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))`)
        .with('user')
        .match(`(user)-[isContactRel:IS_CONTACT]->(contact:User)`)
        .where(`${invisible} (contact.privacyMode = 'public' OR
               (contact.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR
               (contact.privacyMode = 'onlyContact' AND (contact)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
};

let numberOfInvisibleContacts = function (userId, userDetailId) {
    return getPeopleOfTrustWithPrivacyCommand(true)
        .return('count(*) AS numberOfInvisibleContacts')
        .end({userId, userDetailId});
};

let numberOfPeopleInTrustCircle = function (userId, userDetailId) {
    return getPeopleOfTrustWithPrivacyCommand(false)
        .return('count(*) AS numberOfContacts')
        .end({userId, userDetailId});
};

let numberOfSamePeopleInTrustCircle = function (userId, contactId) {
    return db.cypher().match('(:User {userId: {contactId}})-[:IS_CONTACT]->(:User)<-[:IS_CONTACT]-(:User {userId: {userId}})')
        .return('count(*) AS numberOfSameContacts')
        .end({contactId: contactId, userId: userId});
};

let getTrustCircleCommand = function (userId, userDetailId, contactsPerPage, skipContacts) {
    return getPeopleOfTrustWithPrivacyCommand(false)
        .return(`contact.name AS name, contact.userId AS userId, isContactRel.contactAdded AS isContactSince,
                 EXISTS((contact)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isContactOfLoggedInUser`)
        .orderBy(`name`)
        .skip(`{skipContacts}`)
        .limit(`{contactsPerPage}`)
        .end({userDetailId, userId, contactsPerPage, skipContacts});
};

let getTrustCircle = async function (userId, userDetailId, contactsPerPage, skipContacts) {
    let contacts = await getTrustCircleCommand(userId, userDetailId, contactsPerPage, skipContacts).send([
            numberOfPeopleInTrustCircle(userId, userDetailId).getCommand(),
            numberOfInvisibleContacts(userId, userDetailId).getCommand()
        ]
    );
    await userInfo.addImageForThumbnail(contacts[2]);
    return {
        contacts: contacts[2], numberOfContacts: contacts[0][0].numberOfContacts,
        numberOfInvisibleContacts: contacts[1][0].numberOfInvisibleContacts
    };
};


module.exports = {
    numberOfPeopleInTrustCircle,
    numberOfSamePeopleInTrustCircle,
    getTrustCircleCommand,
    getTrustCircle
};
