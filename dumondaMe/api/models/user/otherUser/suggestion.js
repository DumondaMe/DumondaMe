'use strict';

const db = requireDb();
const moreSearchResult = require('../../util/moreSearchResults');
const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;

let trustCircleUserSuggestionCommand = function (userId, limit, skip) {
    return db.cypher()
        .match('(user:User {userId: {userId}})-[:IS_CONTACT]->(:User)-[:IS_CONTACT]->(suggestedUser:User)')
        .where(`NOT (user)-[:IS_CONTACT]->(suggestedUser) AND suggestedUser.privacyMode <> 'onlyContact' AND
                NOT user.userId = suggestedUser.userId AND NOT suggestedUser:HarvestingUser`)
        .with(`user, suggestedUser, count(suggestedUser) AS numberOfIntersectingTrustCircle`)
        .optionalMatch(`(user)-[:INTERESTED]->(interested)<-[:INTERESTED]-(suggestedUser)`)
        .where(`interested:Topic OR interested:Region`)
        .with(`user, suggestedUser, numberOfIntersectingTrustCircle, count(interested) AS numberOfSameInterest`)
        .return(`suggestedUser.userId AS userId, suggestedUser.name AS name, numberOfIntersectingTrustCircle,
                 numberOfSameInterest`)
        .orderBy(`numberOfIntersectingTrustCircle DESC, numberOfSameInterest DESC`)
        .skip(`{skip}`)
        .limit(`{limit}`)
        .end({userId, limit: limit + 1, skip});
};

let ignoreTrustCircleUserSuggestionCommand = function (userId, limit, skip) {
    return db.cypher()
        .match(`(suggestedUser:User)<-[:IS_CONTACT]-(trustUser:User)`)
        .where(`suggestedUser.userId <> {userId} AND NOT (:User {userId: {userId}})-[:IS_CONTACT]->(suggestedUser) AND 
                suggestedUser.privacyMode <> 'onlyContact'`)
        .with(`suggestedUser, count(trustUser) AS numberTrustUser`)
        .optionalMatch(`(:User {userId: {userId}})-[:INTERESTED]->(interested:Topic)<-[:INTERESTED]-(suggestedUser)`)
        .with(`suggestedUser, numberTrustUser, count(interested) AS numberOfSameTopic`)
        .optionalMatch(`(:User {userId: {userId}})-[:INTERESTED]->(interested:Region)<-[:INTERESTED]-(suggestedUser)`)
        .with(`suggestedUser, numberTrustUser, numberOfSameTopic, count(interested) AS numberOfSameRegion`)
        .return(`DISTINCT suggestedUser.userId AS userId, suggestedUser.name AS name, 
                     0 AS numberOfIntersectingTrustCircle, numberOfSameTopic, numberOfSameRegion, numberTrustUser`)
        .orderBy(`numberOfSameTopic DESC, numberOfSameRegion DESC, numberTrustUser DESC`)
        .skip(`{skip}`)
        .limit(`{limit}`)
        .end({userId, limit: limit + 1, skip});
};

let handlingResponse = async function (users) {
    for (let user of users) {
        user.slug = slug(user.name);
        user.profileUrl = await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`);
    }
};

let getSuggestedUsers = async function (userId, limit, skip) {
    let trustCircleSuggestion = true;
    let users = await trustCircleUserSuggestionCommand(userId, limit, skip).send();

    if (users.length === 0 && skip === 0) {
        trustCircleSuggestion = false;
        users = await ignoreTrustCircleUserSuggestionCommand(userId, limit, skip).send();
    }
    await handlingResponse(users);
    let hasMoreUsers = moreSearchResult.getHasMoreResults(users, limit);

    return {users, hasMoreUsers, trustCircleSuggestion};
};

let getSuggestedUsersIgnoreTrustCircle = async function (userId, limit, skip) {
    let trustCircleSuggestion = false;
    let users = await ignoreTrustCircleUserSuggestionCommand(userId, limit, skip).send();

    await handlingResponse(users);
    let hasMoreUsers = moreSearchResult.getHasMoreResults(users, limit);

    return {users, hasMoreUsers, trustCircleSuggestion};
};

module.exports = {
    getSuggestedUsers,
    getSuggestedUsersIgnoreTrustCircle
};
