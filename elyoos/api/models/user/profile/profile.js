/**
 * A model for the user
 */
'use strict';

const db = requireDb();
const dashify = require('dashify');
const cdn = require('elyoos-server-lib').cdn;
const trustCircle = require('./trustCircle');
const peopleTrustUser = require('./peopleTrustUser');
const question = require('./question');
const commitment = require('./commitment');
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
    commands.push(trustCircle.numberOfInvisiblePeopleInTrustCircle(userId, userIdOfProfile).getCommand());
    commands.push(trustCircle.getTrustCircleCommand(userId, userIdOfProfile, 7, 0).getCommand());
    commands.push(peopleTrustUser.numberOfPeopleTrustUser(userId, userIdOfProfile).getCommand());
    commands.push(peopleTrustUser.numberOfInvisiblePeopleTrustUser(userId, userIdOfProfile).getCommand());
    commands.push(peopleTrustUser.getPeopleTrustUserCommand(userId, userIdOfProfile, 7, 0).getCommand());
    commands.push(question.numberOfQuestions(userIdOfProfile, false).getCommand());
    commands.push(question.getQuestionCommand(userIdOfProfile, 4, 0, false).getCommand());
    commands.push(question.numberOfQuestions(userIdOfProfile, true).getCommand());
    commands.push(question.getQuestionCommand(userIdOfProfile, 4, 0, true).getCommand());
    commands.push(commitment.numberOfCommitments(userIdOfProfile, false).getCommand());
    commands.push(commitment.getCommitmentCommand(userIdOfProfile, 4, 0, false).getCommand());
    commands.push(commitment.numberOfCommitments(userIdOfProfile, true).getCommand());
    commands.push(commitment.getCommitmentCommand(userIdOfProfile, 4, 0, true).getCommand());

    let resp = await db.cypher().match(`(u:User {userId: {userIdOfProfile}})`)
        .where(`{userId} = {userIdOfProfile} OR u.privacyMode = 'public' OR 
                (u.privacyMode = 'publicEl' AND {userId} IS NOT NULL) OR 
                (u.privacyMode = 'onlyContact' AND EXISTS((u)-[:IS_CONTACT]->(:User {userId: {userId}})))`)
        .return(`u.forename AS forename, u.surname AS surname, u.userDescription AS userDescription,
                 EXISTS((u)<-[:IS_CONTACT]-(:User {userId: {userId}})) AS isPersonOfTrustOfLoggedInUser`)
        .end({userId, userIdOfProfile}).send(commands);
    if (resp[14].length === 1) {
        let profile = resp[14][0];
        profile.profileImage = await cdn.getSignedUrl(`profileImage/${userIdOfProfile}/profile.jpg`);

        profile.numberOfPeopleOfTrust = resp[0][0].numberOfPeopleOfTrust;
        profile.numberOfInvisiblePeopleOfTrust = resp[1][0].numberOfInvisiblePeopleOfTrust;
        profile.peopleOfTrust = resp[2];
        await userInfo.addImageForThumbnail(resp[2]);

        profile.numberOfPeopleTrustUser = resp[3][0].numberOfPeopleTrustUser;
        profile.numberOfInvisiblePeopleTrustUser = resp[4][0].numberOfInvisiblePeopleTrustUser;
        profile.peopleTrustUser = resp[5];
        await userInfo.addImageForThumbnail(resp[5]);

        profile.numberOfCreatedQuestions = resp[6][0].numberOfQuestions;
        profile.createdQuestions = resp[7];
        question.handlingResponseToQuestion(profile.createdQuestions);

        profile.numberOfWatchingQuestions = resp[8][0].numberOfQuestions;
        profile.watchingQuestions = resp[9];
        question.handlingResponseToQuestion(profile.watchingQuestions);

        profile.numberOfCommitments = resp[10][0].numberOfCommitments;
        profile.commitments = resp[11];
        commitment.handlingResponseOfCommitment(profile.commitments);

        profile.numberOfWatchingCommitments = resp[12][0].numberOfCommitments;
        profile.watchingCommitments = resp[13];
        commitment.handlingResponseOfCommitment(profile.watchingCommitments);

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
