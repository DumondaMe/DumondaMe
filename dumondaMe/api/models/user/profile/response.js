/**
 * A model for the user
 */
'use strict';

const slug = require('limax');
const cdn = require('dumonda-me-server-lib').cdn;
const answerResponseHandler = require('./../feed/response');
const userInfo = require('./../userInfo');

let addSlugToPeople = function (peopleOfTrust) {
    for (let person of peopleOfTrust) {
        person.slug = slug(person.name);
    }
};

let getAdminOfCommitments = function (commitments) {
    let result = [];
    for (let commitment of commitments) {
        result.push({
            commitmentId: commitment.commitmentId,
            title: commitment.title,
            slug: slug(commitment.title),
            imageUrl: cdn.getPublicUrl(`commitment/${commitment.commitmentId}/40x40/title.jpg`, commitment.modified)
        })
    }
    return result;
};

let getUserProfileResponse = async function (userId, userIdOfProfile, profile, numberOfPeopleOfTrust,
                                             numberOfInvisiblePeopleOfTrust, peopleOfTrust, numberOfPeopleTrustUser,
                                             numberOfInvisiblePeopleTrustUser, peopleTrustUser, feed, adminOfCommitments) {

    profile.profileImage = await cdn.getSignedUrl(`profileImage/${userIdOfProfile}/profile.jpg`);

    profile.numberOfPeopleOfTrust = numberOfPeopleOfTrust;
    profile.numberOfInvisiblePeopleOfTrust = numberOfInvisiblePeopleOfTrust;
    profile.peopleOfTrust = peopleOfTrust;
    await userInfo.addImageForThumbnail(peopleOfTrust);

    profile.numberOfPeopleTrustUser = numberOfPeopleTrustUser;
    profile.numberOfInvisiblePeopleTrustUser = numberOfInvisiblePeopleTrustUser;
    profile.peopleTrustUser = peopleTrustUser;
    await userInfo.addImageForThumbnail(peopleTrustUser);

    profile.isLoggedInUser = userId === userIdOfProfile;

    if (profile.showProfileActivity || profile.isLoggedInUser) {
        profile.feed = await answerResponseHandler.getFeed(feed, userId);
    } else {
        profile.feed = [];
    }

    addSlugToPeople(profile.peopleOfTrust);
    addSlugToPeople(profile.peopleTrustUser);

    profile.adminOfCommitments = getAdminOfCommitments(adminOfCommitments);
    return profile;
};

module.exports = {
    getUserProfileResponse
};
