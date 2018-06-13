'use strict';

let db = requireDb();
let userInfo = require('../userInfo');
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAllowedToGetProfile = async function (userId, userDetailId, req) {
    userId = userId || null;
    let response = await db.cypher().match('(user:User {userId: {userDetailId}})')
        .where(`user.privacyMode = 'public' OR user.userId = {userId} OR 
               (user.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR
               (user.privacyMode = 'onlyContact' AND (user)-[:IS_CONTACT]->(:User {userId: {userId}}))`)
        .return(`user`).end({userId, userDetailId}).send();
    if (response.length !== 1) {
        return exceptions.getUnauthorized(`User ${userId} has not access rights to view user profile ${userDetailId}`,
            logger, req);
    }
};

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
    await checkAllowedToGetProfile(userId, userDetailId, req);

    let resp = await getPeopleTrustUserCommand(userId, userDetailId, contactsPerPage, skipContacts)
        .send([numberOfPeopleTrustUser(userId, userDetailId).getCommand(),
            numberOfInvisiblePeopleTrustUser(userId, userDetailId).getCommand()]);
    await userInfo.addImageForThumbnail(resp[2]);
    return {
        peopleTrustUser: resp[2], numberOfPeopleTrustUser: resp[0][0].numberOfPeopleTrustUser,
        numberOfInvisiblePeopleTrustUser: resp[1][0].numberOfInvisiblePeopleTrustUser
    };
};

module.exports = {
    numberOfPeopleTrustUser,
    numberOfInvisiblePeopleTrustUser,
    getPeopleTrustUserCommand,
    getPeopleTrustUser
};
