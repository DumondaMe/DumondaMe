'use strict';

/*The complete tests of recommending users are done in home recommended user spec */

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests getting contact recommendations', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(11);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting mixed contact recommendation', function () {
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('8', '3', 'Freund');
        dbDsl.createContactConnection('7', '3', 'Freund');
        dbDsl.createContactConnection('6', '3', 'Freund');

        dbDsl.createContactConnection('1', '5', 'Freund');
        dbDsl.createContactConnection('1', '10', 'Freund');
        dbDsl.createContactConnection('5', '2', 'Freund');
        dbDsl.createContactConnection('10', '2', 'Freund');

        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('4', '9', 'Freund');

        dbDsl.inviteUser('11', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/recommendationContact', {
                maxItemsPerType: 10,
                skipInvitedUser: 0,
                skipRecommendedByContact: 0,
                skipRecommended: 3
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(4);

            res.body.recommendedUser[0].userId.should.equals('11');
            res.body.recommendedUser[0].name.should.equals('user Meier11');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/11/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('2');
            res.body.recommendedUser[1].name.should.equals('user Meier2');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/2/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('9');
            res.body.recommendedUser[2].name.should.equals('user Meier9');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/9/thumbnail.jpg');

            res.body.recommendedUser[3].userId.should.equals('8');
            res.body.recommendedUser[3].name.should.equals('user Meier8');
            res.body.recommendedUser[3].profileUrl.should.equals('profileImage/8/thumbnail.jpg');

            res.body.showUserRecommendation.should.equals(true);
            res.body.skipInvitedUser.should.equals(1);
            res.body.skipRecommendedByContact.should.equals(2);
            res.body.skipRecommended.should.equals(4);
        });
    });

    it('Getting invited contact recommendation', function () {
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.inviteUser('11', '1');
        dbDsl.inviteUser('1', '10');
        dbDsl.inviteUser('1', '9');
        dbDsl.inviteUser('6', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/recommendationContact', {
                maxItemsPerType: 10,
                skipInvitedUser: 1,
                skipRecommendedByContact: 0,
                skipRecommended: 10
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(3);

            res.body.recommendedUser[0].userId.should.equals('11');
            res.body.recommendedUser[0].name.should.equals('user Meier11');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/11/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('6');
            res.body.recommendedUser[1].name.should.equals('user Meier6');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/6/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('9');
            res.body.recommendedUser[2].name.should.equals('user Meier9');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/9/thumbnail.jpg');

            res.body.showUserRecommendation.should.equals(true);
            res.body.skipInvitedUser.should.equals(4);
            res.body.skipRecommendedByContact.should.equals(0);
            res.body.skipRecommended.should.equals(10);
        });
    });

    it('Getting contact recommendation sorted by number of contacts and location', function () {
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('8', '3', 'Freund');

        dbDsl.createContactConnection('1', '5', 'Freund');
        dbDsl.createContactConnection('1', '6', 'Freund');
        dbDsl.createContactConnection('1', '7', 'Freund');
        dbDsl.createContactConnection('5', '2', 'Freund');
        dbDsl.createContactConnection('6', '2', 'Freund');
        dbDsl.createContactConnection('7', '2', 'Freund');

        dbDsl.createContactConnection('6', '4', 'Freund');
        dbDsl.createContactConnection('7', '4', 'Freund');

        dbDsl.createContactConnection('5', '9', 'Freund');
        dbDsl.createContactConnection('6', '9', 'Freund');

        dbDsl.setUserLocation('1', {description: 'Zürich', latitude: 47.3685586, longitude: 8.5404434});
        dbDsl.setUserLocation('9', {description: 'Urdorf', latitude: 47.384708, longitude: 8.4259004});
        dbDsl.setUserLocation('4', {description: 'Bülach', latitude: 47.5200297, longitude: 8.5433074});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/recommendationContact', {
                maxItemsPerType: 10,
                skipInvitedUser: 0,
                skipRecommendedByContact: 0,
                skipRecommended: 10
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(3);

            res.body.recommendedUser[0].userId.should.equals('2');
            res.body.recommendedUser[0].name.should.equals('user Meier2');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('9');
            res.body.recommendedUser[1].name.should.equals('user Meier9');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/9/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('4');
            res.body.recommendedUser[2].name.should.equals('user Meier4');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/4/thumbnail.jpg');

            res.body.showUserRecommendation.should.equals(true);
            res.body.skipInvitedUser.should.equals(0);
            res.body.skipRecommendedByContact.should.equals(3);
            res.body.skipRecommended.should.equals(10);
        });
    });

    it('Getting user recommendation sorted by number of contacts and location, without contact connections', function () {
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '5', 'Freund');
        dbDsl.createContactConnection('3', '5', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');

        dbDsl.createContactConnection('6', '8', 'Freund');
        dbDsl.createContactConnection('7', '8', 'Freund');

        dbDsl.createContactConnection('9', '11', 'Freund');
        dbDsl.createContactConnection('10', '11', 'Freund');


        dbDsl.setUserLocation('5', {description: 'Zürich', latitude: 47.3685586, longitude: 8.5404434});
        dbDsl.setUserLocation('8', {description: 'Urdorf', latitude: 47.384708, longitude: 8.4259004});
        dbDsl.setUserLocation('11', {description: 'Bülach', latitude: 47.5200297, longitude: 8.5433074});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/recommendationContact', {
                maxItemsPerType: 10,
                skipInvitedUser: 0,
                skipRecommendedByContact: 0,
                skipRecommended: 0
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(10);

            res.body.recommendedUser[0].userId.should.equals('5');
            res.body.recommendedUser[0].name.should.equals('user Meier5');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/5/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('8');
            res.body.recommendedUser[1].name.should.equals('user Meier8');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/8/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('11');
            res.body.recommendedUser[2].name.should.equals('user Meier11');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/11/thumbnail.jpg');

            res.body.showUserRecommendation.should.equals(true);
            res.body.skipInvitedUser.should.equals(0);
            res.body.skipRecommendedByContact.should.equals(0);
            res.body.skipRecommended.should.equals(10);
        });
    });

    it('Show user recommendation on home screen is set to null', function () {
        dbDsl.setRecommendedUserOnHomeScreen(false);
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/recommendationContact', {
                maxItemsPerType: 10,
                skipInvitedUser: 0,
                skipRecommendedByContact: 0,
                skipRecommended: 0,
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(10);

            res.body.showUserRecommendation.should.equals(false);
        });
    });
});
