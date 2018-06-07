/**
 * A model for the user
 */
'use strict';

const db = requireDb();
const dashify = require('dashify');
const cdn = require('elyoos-server-lib').cdn;
const trustCircle = require('./trustCircle');
const peopleTrustUser = require('./peopleTrustUser');
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

let getUserProfile = async function (userId, userIdOfProfile) {

    checkAllowedToGetProfile(userId, userIdOfProfile);
    userId = userId || null;
    userIdOfProfile = userIdOfProfile || userId;
    let commands = [];
    commands.push(trustCircle.numberOfPeopleInTrustCircle(userId, userIdOfProfile).getCommand());
    commands.push(trustCircle.getTrustCircleCommand(userId, userIdOfProfile, 10, 0).getCommand());
    commands.push(peopleTrustUser.numberOfPeopleTrustUser(userIdOfProfile).getCommand());
    commands.push(peopleTrustUser.getPeopleTrustUserCommand(userId, userIdOfProfile, 10, 0).getCommand());

    let resp = await db.cypher().match(`(u:User {userId: {userIdOfProfile}})`)
        .where(`{userId} = {userIdOfProfile} OR u.privacyMode = 'public' OR 
                (u.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR 
                (u.privacyMode = 'onlyContact' AND EXISTS((u)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return(`u.forename AS forename, u.surname AS surname, u.userDescription AS userDescription,
                 EXISTS((u)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isPersonOfTrustOfLoggedInUser`)
        .end({userId, userIdOfProfile}).send(commands);
    if (resp[4].length === 1) {
        let profile = resp[4][0];
        profile.profileImage = await cdn.getSignedUrl(`profileImage/${userIdOfProfile}/profile.jpg`);
        profile.numberOfPeopleOfTrust = resp[0][0].numberOfContacts;
        profile.isLoggedInUser = userId === userIdOfProfile;
        await userInfo.addImageForThumbnail(resp[1]);
        await userInfo.addImageForThumbnail(resp[3]);
        profile.peopleOfTrust = resp[1];
        profile.numberOfPeopleTrustUser = resp[2][0].numberOfPeopleTrustUser;
        profile.peopleTrustUser = resp[3];
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
