'use strict';

/*The complete tests of recommending users are done in home recommended user spec */

var users = require('elyoos-server-test-util').user;
var dbDsl = require('elyoos-server-test-util').dbDSL;
var requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Integration Tests getting contact recommendations', function () {

    var requestAgent;

    beforeEach(function () {
        return dbDsl.init(10);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Getting contact recommendation - Return 200', function () {
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
            return requestHandler.getWithData('/api/user/contact/recommendationContact', null, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(3);
            res.body.recommendedUser[0].userId.should.equals('2');
            res.body.recommendedUser[0].name.should.equals('user Meier2');
            res.body.recommendedUser[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');

            res.body.recommendedUser[1].userId.should.equals('9');
            res.body.recommendedUser[1].name.should.equals('user Meier9');
            res.body.recommendedUser[1].profileUrl.should.equals('profileImage/9/thumbnail.jpg');

            res.body.recommendedUser[2].userId.should.equals('3');
            res.body.recommendedUser[2].name.should.equals('user Meier3');
            res.body.recommendedUser[2].profileUrl.should.equals('profileImage/3/thumbnail.jpg');

            res.body.showUserRecommendation.should.equals(true);
        });
    });

    it('Show user recommendation on home screen is set to null- Return 200', function () {
        dbDsl.setRecommendedUserOnHomeScreen(false);
        dbDsl.createPrivacyNoContact(null, {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
        dbDsl.createPrivacy(null, 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return requestHandler.getWithData('/api/user/contact/recommendationContact', null, requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            res.body.recommendedUser.length.should.equals(0);

            res.body.showUserRecommendation.should.equals(false);
        });
    });
});
