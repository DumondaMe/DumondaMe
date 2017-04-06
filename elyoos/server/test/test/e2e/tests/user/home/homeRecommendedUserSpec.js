'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests for getting contact recommendation on the home screen', function () {

    let requestAgent;

    beforeEach(function () {
        return dbDsl.init(12);
    });

    afterEach(function () {
        return requestHandler.logout();
    });


    it('Contact recommendation for user with no contacts (no contacting)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('4', '3', 'Freund');
        dbDsl.createContactConnection('5', '3', 'Freund');
        dbDsl.createContactConnection('6', '3', 'Freund');

        dbDsl.createContactConnection('2', '5', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');
        dbDsl.createContactConnection('6', '5', 'Freund');

        dbDsl.createContactConnection('3', '4', 'Freund');
        dbDsl.createContactConnection('6', '4', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(10);
            res.body.recommendedUser[0].userId.should.equals('3');
            res.body.recommendedUser[0].name.should.equals('user Meier3');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('5');
            res.body.recommendedUser[1].name.should.equals('user Meier5');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/5/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('4');
            res.body.recommendedUser[2].name.should.equals('user Meier4');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
        });
    });

    it('Contact recommendation for user with no contacts (no contacting, with invitations)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('4', '3', 'Freund');
        dbDsl.createContactConnection('5', '3', 'Freund');
        dbDsl.createContactConnection('6', '3', 'Freund');

        dbDsl.createContactConnection('2', '5', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');
        dbDsl.createContactConnection('6', '5', 'Freund');

        dbDsl.createContactConnection('3', '4', 'Freund');
        dbDsl.createContactConnection('6', '4', 'Freund');

        dbDsl.inviteUser('10', '1');
        dbDsl.inviteUser('9', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(11);
            res.body.recommendedUser[0].userId.should.equals('10');
            res.body.recommendedUser[0].name.should.equals('user Meier10');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/10/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('9');
            res.body.recommendedUser[1].name.should.equals('user Meier9');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/9/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('3');
            res.body.recommendedUser[2].name.should.equals('user Meier3');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/3/thumbnail.jpg');

            res.body.recommendedUser[3].userId.should.equals('5');
            res.body.recommendedUser[3].name.should.equals('user Meier5');
            res.body.recommendedUser[3].profileUrl.should.equals('profileImage/5/thumbnail.jpg');

            res.body.recommendedUser[4].userId.should.equals('4');
            res.body.recommendedUser[4].name.should.equals('user Meier4');
            res.body.recommendedUser[4].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
        });
    });

    it('Contact recommendation for user with no contacts show only invitations (no contacting, with invitations)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('4', '3', 'Freund');
        dbDsl.createContactConnection('5', '3', 'Freund');
        dbDsl.createContactConnection('6', '3', 'Freund');

        dbDsl.inviteUser('3', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(11);
            res.body.recommendedUser[0].userId.should.equals('3');
            res.body.recommendedUser[0].name.should.equals('user Meier3');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');

        });
    });

    it('Contact Recommendation for user with contacts (no contacting)', function () {

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

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(8);
            res.body.recommendedUser[0].userId.should.equals('2');
            res.body.recommendedUser[0].name.should.equals('user Meier2');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('9');
            res.body.recommendedUser[1].name.should.equals('user Meier9');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/9/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('3');
            res.body.recommendedUser[2].name.should.equals('user Meier3');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
        });
    });

    it('Contact Recommendation for user with contacts (no contacting, with invitations)', function () {

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

        dbDsl.inviteUser('12', '1');
        dbDsl.inviteUser('11', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(8);
            res.body.recommendedUser[0].userId.should.equals('11');
            res.body.recommendedUser[0].name.should.equals('user Meier11');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/11/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('12');
            res.body.recommendedUser[1].name.should.equals('user Meier12');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/12/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('2');
            res.body.recommendedUser[2].name.should.equals('user Meier2');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/2/thumbnail.jpg');

            res.body.recommendedUser[3].userId.should.equals('9');
            res.body.recommendedUser[3].name.should.equals('user Meier9');
            res.body.recommendedUser[3].profileUrl.should.equals('profileImage/9/thumbnail.jpg');

            res.body.recommendedUser[4].userId.should.equals('3');
            res.body.recommendedUser[4].name.should.equals('user Meier3');
            res.body.recommendedUser[4].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
        });
    });

    it('Contact Recommendation for user with contacts show only invitations(no contacting, with invitations)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '5', 'Freund');
        dbDsl.createContactConnection('1', '10', 'Freund');
        dbDsl.createContactConnection('5', '2', 'Freund');
        dbDsl.createContactConnection('10', '2', 'Freund');

        dbDsl.inviteUser('2', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(9);
            res.body.recommendedUser[0].userId.should.equals('2');
            res.body.recommendedUser[0].name.should.equals('user Meier2');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
        });
    });

    it('Do not return recommended user when user has feature disabled for home screen', function () {

        dbDsl.setRecommendedUserOnHomeScreen(false);
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

        dbDsl.inviteUser('12', '1');
        dbDsl.inviteUser('11', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.recommendedUser.length.should.equals(0);
        });
    });

    it('Contact Recommendation for user with contacts (ignore contacts of user)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '3', 'Freund');
        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('8', '3', 'Freund');
        dbDsl.createContactConnection('7', '3', 'Freund');
        dbDsl.createContactConnection('6', '3', 'Freund');

        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('1', '9', 'Freund');
        dbDsl.createContactConnection('4', '9', 'Freund');

        dbDsl.createContactConnection('1', '5', 'Freund');
        dbDsl.createContactConnection('5', '2', 'Freund');

        dbDsl.inviteUser('4', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(7);
            res.body.recommendedUser[0].userId.should.equals('2');
            res.body.recommendedUser[0].name.should.equals('user Meier2');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
        });
    });

    it('User contacts based recommendations are order by most contacting', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('1', '2', 'Freund');
        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('4', '3', 'Freund');
        dbDsl.createContactConnection('5', '3', 'Freund');

        dbDsl.createContactConnection('1', '6', 'Freund');
        dbDsl.createContactConnection('6', '7', 'Freund');
        dbDsl.createContactConnection('8', '7', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(9);
            res.body.recommendedUser[0].userId.should.equals('3');
            res.body.recommendedUser[0].name.should.equals('user Meier3');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('7');
            res.body.recommendedUser[1].name.should.equals('user Meier7');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/7/thumbnail.jpg');
        });
    });

    it('Ignore Contact Recommendation for user when contacting happens since previous login', function () {

        dbDsl.setUserLastLoginTime(5000);

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('3', '1', 'Freund', 4999);

        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');
        dbDsl.createContactConnection('5', '1', 'Freund', 4999);

        dbDsl.createContactConnection('6', '7', 'Freund');
        dbDsl.createContactConnection('7', '1', 'Freund', 5001);

        dbDsl.createContactConnection('1', '8', 'Freund');
        dbDsl.createContactConnection('8', '9', 'Freund');
        dbDsl.createContactConnection('9', '1', 'Freund', 5001);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(7);
            res.body.recommendedUser[0].userId.should.equals('5');
            res.body.recommendedUser[0].name.should.equals('user Meier5');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/5/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('3');
            res.body.recommendedUser[1].name.should.equals('user Meier3');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
        });
    });

    it('Ignore recommendation when user has blocked this person', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.blockUser('1', '3');
        dbDsl.blockUser('1', '7');
        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('4', '3', 'Freund');
        dbDsl.createContactConnection('5', '3', 'Freund');

        dbDsl.createContactConnection('1', '6', 'Freund');
        dbDsl.createContactConnection('6', '7', 'Freund');

        dbDsl.inviteUser('3', '1');
        dbDsl.inviteUser('7', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(8);
            res.body.recommendedUser[0].userId.should.equals('10');
            res.body.recommendedUser[1].userId.should.equals('11');
            res.body.recommendedUser[2].userId.should.equals('12');
            res.body.recommendedUser[3].userId.should.equals('2');
            res.body.recommendedUser[4].userId.should.equals('4');
            res.body.recommendedUser[5].userId.should.equals('5');
            res.body.recommendedUser[6].userId.should.equals('8');
            res.body.recommendedUser[7].userId.should.equals('9');
        });
    });

    it('Ignore recommendation when recommended person has blocked user', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.blockUser('3', '1');
        dbDsl.blockUser('7', '1');
        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('4', '3', 'Freund');
        dbDsl.createContactConnection('5', '3', 'Freund');

        dbDsl.createContactConnection('1', '6', 'Freund');
        dbDsl.createContactConnection('6', '7', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(8);
            res.body.recommendedUser[0].userId.should.equals('10');
            res.body.recommendedUser[1].userId.should.equals('11');
            res.body.recommendedUser[2].userId.should.equals('12');
            res.body.recommendedUser[3].userId.should.equals('2');
            res.body.recommendedUser[4].userId.should.equals('4');
            res.body.recommendedUser[5].userId.should.equals('5');
            res.body.recommendedUser[6].userId.should.equals('8');
            res.body.recommendedUser[7].userId.should.equals('9');
        });
    });

    it('Do not recommend user because profile is set to false (no contact relations to user)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');

        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(0);
        });
    });

    it('Do not recommend user because profile is set to false (no contact relations to user, only invitation)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: false, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.inviteUser('3', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(0);
        });
    });

    it('Hide recommended contact image (no contact relations to user, image=false)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');

        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(10);
            res.body.recommendedUser[0].userId.should.equals('5');
            res.body.recommendedUser[0].name.should.equals('user Meier5');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('3');
            res.body.recommendedUser[1].name.should.equals('user Meier3');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
        });
    });

    it('Hide recommended contact image (no contact relations to user, image=false, invitation)', function () {

        dbDsl.createPrivacyNoContact(null, {profile: true, image: false, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.inviteUser('3', '1');

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(11);
            res.body.recommendedUser[0].userId.should.equals('3');
            res.body.recommendedUser[0].name.should.equals('user Meier3');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
        });
    });

    it('Do not recommend user because profile is set to false (contact relations to user)', function () {

        dbDsl.setUserLastLoginTime(5000);

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['3', '5'], 'Freund', {profile: false, image: true, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('3', '1', 'Freund', 4999);

        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');
        dbDsl.createContactConnection('5', '1', 'Freund', 4999);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(8);
            res.body.recommendedUser[0].userId.should.equals('10');
            res.body.recommendedUser[1].userId.should.equals('11');
            res.body.recommendedUser[2].userId.should.equals('12');
            res.body.recommendedUser[3].userId.should.equals('2');
            res.body.recommendedUser[4].userId.should.equals('6');
            res.body.recommendedUser[5].userId.should.equals('7');
            res.body.recommendedUser[6].userId.should.equals('8');
            res.body.recommendedUser[7].userId.should.equals('9');
        });
    });

    it('Hide recommended contact image (contact relations to user, image=false)', function () {

        dbDsl.setUserLastLoginTime(5000);

        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(['3', '5'], 'Freund', {profile: true, image: false, profileData: true, contacts: true, pinwall: true});

        dbDsl.createContactConnection('2', '3', 'Freund');
        dbDsl.createContactConnection('3', '1', 'Freund', 4999);

        dbDsl.createContactConnection('1', '4', 'Freund');
        dbDsl.createContactConnection('4', '5', 'Freund');
        dbDsl.createContactConnection('5', '1', 'Freund', 4999);

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/home', {
                skipBlog: 0,
                skipRecommendation: 0,
                maxItems: 10,
                onlyContact: true,
                order: 'new'
            }, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(10);
            res.body.recommendedUser[0].userId.should.equals('5');
            res.body.recommendedUser[0].name.should.equals('user Meier5');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('3');
            res.body.recommendedUser[1].name.should.equals('user Meier3');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
        });
    });
});
