'use strict';

let db = requireDb();
let userInfo = require('../userInfo');

let numberOfPeopleTrustUser = function (userId, userDetailId) {
    return db.cypher().match('(:User {userId: {userDetailId}})<-[:IS_CONTACT]-(user:User)')
        .where(`user.privacyMode = 'public' OR user.userId = {userId} OR 
               (user.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR
               (user.privacyMode = 'onlyContact' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))`)
        .return('count(*) AS numberOfPeopleTrustUser')
        .end({userId, userDetailId});
};

let numberOfInvisiblePeopleTrustUser = function (userId, userDetailId) {
    return db.cypher().match('(:User {userId: {userDetailId}})<-[:IS_CONTACT]-(user:User)')
        .where(`NOT (user.privacyMode = 'public' OR
               (user.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR
               (user.privacyMode = 'onlyContact' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return('count(*) AS numberOfInvisiblePeopleTrustUser')
        .end({userId, userDetailId});
};

let getPeopleTrustUserCommand = function (userId, userDetailId, personPerPage, skipPeople) {

    return db.cypher().match('(:User {userId: {userDetailId}})<-[:IS_CONTACT]-(user:User)')
        .where(`user.privacyMode = 'public' OR user.userId = {userId} OR 
               (user.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR
               (user.privacyMode = 'onlyContact' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))`)
        .return(`user.name AS name, user.userId AS userId, user.userId = {userId} AS isLoggedInUser,
                 EXISTS((user)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isPersonOfTrust`)
        .orderBy('name')
        .skip('{skipPeople}')
        .limit('{personPerPage}')
        .end({userDetailId, userId, personPerPage, skipPeople});
};

let getPeopleTrustUser = async function (userId, userDetailId, contactsPerPage, skipContacts, req) {
    let resp = await getPeopleTrustUserCommand(userId, userDetailId, contactsPerPage, skipContacts).send();
    await userInfo.addImageForPreview(resp);
    return {users: resp};
};

module.exports = {
    numberOfPeopleTrustUser,
    numberOfInvisiblePeopleTrustUser,
    getPeopleTrustUserCommand,
    getPeopleTrustUser
};
