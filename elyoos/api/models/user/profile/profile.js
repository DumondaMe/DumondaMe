/**
 * A model for the user
 */
'use strict';

let db = requireDb();
let cdn = require('elyoos-server-lib').cdn;
let contact = require('./contact');
let userInfo = require('./../userInfo');

let checkAllowedToGetProfile = function (userId, userIdOfProfile) {
    if (!userId && !userIdOfProfile) {
        throw new Error('401');
    }
};

let getUserProfile = async function (userId, userIdOfProfile) {

    checkAllowedToGetProfile(userId, userIdOfProfile);
    userId = userId || null;
    userIdOfProfile = userIdOfProfile || userId;
    let commands = [];
    commands.push(contact.numberOfContacts(userId, userIdOfProfile).getCommand());
    commands.push(contact.getContactsCommand(userId, userIdOfProfile, 10, 0).getCommand());

    let resp = await db.cypher().match(`(u:User {userId: {userIdOfProfile}})`)
        .where(`{userId} = {userIdOfProfile} OR u.privacyMode = 'public' OR 
                (u.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR 
                (u.privacyMode = 'onlyContact' AND EXISTS((u)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return(`u.forename AS forename, u.surname AS surname`)
        .end({userId, userIdOfProfile}).send(commands);
    if (resp[2].length === 1) {
        let profile = resp[2][0];
        profile.profileImage = await cdn.getSignedUrl(`profileImage/${userIdOfProfile}/profile.jpg`);
        profile.numberOfContacts = resp[0][0].numberOfContacts;
        profile.isLoggedInUser = userId === userIdOfProfile;
        await userInfo.addImageForThumbnail(resp[1]);
        profile.contacts = resp[1];
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
            name: name,
            forename: userData.forename,
            surname: userData.surname
        }).end({id: userId}).send();
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
