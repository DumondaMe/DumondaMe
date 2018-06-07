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

let numberOfInvisiblePeopleInTrustCircle = function (userId, userDetailId) {
    return getPeopleOfTrustWithPrivacyCommand(true)
        .return('count(*) AS numberOfInvisiblePeopleOfTrust')
        .end({userId, userDetailId});
};

let numberOfPeopleInTrustCircle = function (userId, userDetailId) {
    return getPeopleOfTrustWithPrivacyCommand(false)
        .return('count(*) AS numberOfPeopleOfTrust')
        .end({userId, userDetailId});
};

let getTrustCircleCommand = function (userId, userDetailId, contactsPerPage, skipContacts) {
    return getPeopleOfTrustWithPrivacyCommand(false)
        .return(`contact.name AS name, contact.userId AS userId, isContactRel.contactAdded AS personOfTrustSince,
                 EXISTS((contact)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isPersonOfTrust`)
        .orderBy(`name`)
        .skip(`{skipContacts}`)
        .limit(`{contactsPerPage}`)
        .end({userDetailId, userId, contactsPerPage, skipContacts});
};

let getTrustCircle = async function (userId, userDetailId, contactsPerPage, skipContacts) {
    let peopleOfTrust = await getTrustCircleCommand(userId, userDetailId, contactsPerPage, skipContacts).send([
            numberOfPeopleInTrustCircle(userId, userDetailId).getCommand(),
            numberOfInvisiblePeopleInTrustCircle(userId, userDetailId).getCommand()
        ]
    );
    await userInfo.addImageForThumbnail(peopleOfTrust[2]);
    return {
        peopleOfTrust: peopleOfTrust[2], numberOfPeopleOfTrust: peopleOfTrust[0][0].numberOfPeopleOfTrust,
        numberOfInvisiblePeopleOfTrust: peopleOfTrust[1][0].numberOfInvisiblePeopleOfTrust
    };
};


module.exports = {
    numberOfPeopleInTrustCircle,
    numberOfInvisiblePeopleInTrustCircle,
    getTrustCircleCommand,
    getTrustCircle
};
