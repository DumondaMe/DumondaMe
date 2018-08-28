/**
 * A model for the user
 */
'use strict';

const db = requireDb();
const dashify = require('dashify');
const cdn = require('elyoos-server-lib').cdn;
const trustCircle = require('./trustCircle');
const peopleTrustUser = require('./peopleTrustUser');
const activity = require('./activity');
const answerResponseHandler = require('./../feed/response');
const userInfo = require('./../userInfo');

let checkAllowedToGetProfile = function (userId, userIdOfProfile) {
    if (!userId && !userIdOfProfile) {
        throw new Error('401');
    }
};

let addSlugToPeople = function (peopleOfTrust) {
    for (let person of peopleOfTrust) {
        person.slug = dashify(person.name);
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

    let resp = await db.cypher().match(`(u:User {userId: {userIdOfProfile}})`)
        .where(`{userId} = {userIdOfProfile} OR u.privacyMode = 'public' OR 
                (u.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR 
                (u.privacyMode = 'onlyContact' AND EXISTS((u)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return(`u.userId AS userId, u.forename AS forename, u.surname AS surname, u.userDescription AS userDescription,
                 EXISTS((u)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isPersonOfTrustOfLoggedInUser`)
        .end({userId, userIdOfProfile}).send(commands);
    if (resp[7].length === 1) {
        let profile = resp[7][0];
        profile.profileImage = await cdn.getSignedUrl(`profileImage/${userIdOfProfile}/profile.jpg`);

        profile.numberOfPeopleOfTrust = resp[0][0].numberOfPeopleOfTrust;
        profile.numberOfInvisiblePeopleOfTrust = resp[1][0].numberOfInvisiblePeopleOfTrust;
        profile.peopleOfTrust = resp[2];
        await userInfo.addImageForThumbnail(resp[2]);

        profile.numberOfPeopleTrustUser = resp[3][0].numberOfPeopleTrustUser;
        profile.numberOfInvisiblePeopleTrustUser = resp[4][0].numberOfInvisiblePeopleTrustUser;
        profile.peopleTrustUser = resp[5];
        await userInfo.addImageForThumbnail(resp[5]);

        profile.feed = await answerResponseHandler.getFeed(resp[6], userId);


        profile.isLoggedInUser = userId === userIdOfProfile;
        addSlugToPeople(profile.peopleOfTrust);
        addSlugToPeople(profile.peopleTrustUser);
        return profile;
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
