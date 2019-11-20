/**
 * A model for the user
 */
'use strict';

const db = requireDb();
const trustCircle = require('./trustCircle');
const peopleTrustUser = require('./peopleTrustUser');
const activity = require('./activity');
const adminOfCommitment = require('./adminOfCommitment');
const response = require('./response');
const responseHarvestingUser = require('./responseHarvestingUser');
const feedHarvestingUser = require('./feedHarvestingUser');

let checkAllowedToGetProfile = function (userId, userIdOfProfile) {
    if (!userId && !userIdOfProfile) {
        throw new Error('401');
    }
};

let getUserProfile = async function (userId, userIdOfProfile, languages, guiLanguage, timestamp) {

    checkAllowedToGetProfile(userId, userIdOfProfile);
    userId = userId || null;
    userIdOfProfile = userIdOfProfile || userId;
    let commands = [];
    commands.push(trustCircle.numberOfPeopleInTrustCircle(userId, userIdOfProfile).getCommand());
    commands.push(trustCircle.numberOfInvisiblePeopleInTrustCircle(userId, userIdOfProfile).getCommand());
    commands.push(trustCircle.getTrustCircleCommand(userId, userIdOfProfile, 7, 0).getCommand());
    commands.push(peopleTrustUser.numberOfPeopleTrustUser(userId, userIdOfProfile).getCommand());
    commands.push(peopleTrustUser.numberOfInvisiblePeopleTrustUser(userId, userIdOfProfile).getCommand());
    commands.push(peopleTrustUser.getPeopleTrustUserCommand(userId, userIdOfProfile, 7, 0).getCommand());
    commands.push(activity.getFeedCommand(userId, userIdOfProfile, 0, timestamp, languages, guiLanguage).getCommand());
    commands.push(adminOfCommitment.getAdminOfCommitmentsCommand(userIdOfProfile, 0).getCommand());

    let resp = await db.cypher().match(`(u:User {userId: {userIdOfProfile}})`)
        .where(`{userId} = {userIdOfProfile} OR u.privacyMode = 'public' OR 
                (u.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR 
                (u.privacyMode = 'onlyContact' AND EXISTS((u)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return(`u.userId AS userId, u.forename AS forename, u.surname AS surname, u.userDescription AS userDescription,
                 u.showProfileActivity AS showProfileActivity, u.start AS start, u.end AS end, u.link AS link, 
                 u.address AS address,
                 ANY (label IN LABELS(u) WHERE label = 'HarvestingUser') AS isHarvestingUser,
                 ANY (label IN LABELS(u) WHERE label = 'OnlineHarvesting') AS isOnlineHarvesting,
                 EXISTS((u)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isPersonOfTrustOfLoggedInUser`)
        .end({userId, userIdOfProfile}).send(commands);
    if (resp[8].length === 1) {
        if (resp[8][0].isHarvestingUser) {
            let feed = await feedHarvestingUser.getFeed(userIdOfProfile);
            return responseHarvestingUser.getUserProfileResponse(userId, userIdOfProfile, resp[8][0], feed);
        }
        return response.getUserProfileResponse(userId, userIdOfProfile, resp[8][0], resp[0][0].numberOfPeopleOfTrust,
            resp[1][0].numberOfInvisiblePeopleOfTrust, resp[2], resp[3][0].numberOfPeopleTrustUser,
            resp[4][0].numberOfInvisiblePeopleTrustUser, resp[5], resp[6], resp[7]);
    }
    throw new Error('401');
};

let updateUserProfile = function (userId, userData) {

    let name;
    if (userData.forename && userData.surname) {
        name = userData.forename + ' ' + userData.surname;
    }
    return db.cypher().match('(u:User {userId: {id}})')
        .set('u', {
            name: name, forename: userData.forename, surname: userData.surname,
            userDescription: userData.userDescription
        }).end({id: userId}).send();
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
