'use strict';

let libUser = require('elyoos-server-lib').user();
let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let moment = require('moment');

describe('Integration Tests user info', function () {

    let startTime;

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return dbDsl.init(3).then(function () {
            startTime = Math.floor(moment.utc().valueOf() / 1000);
            dbDsl.createPrivacyNoContact(null, {profile: false, image: false, profileData: false, contacts: false, pinwall: false});
            dbDsl.createPrivacy(['1', '3'], 'Freund', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
            dbDsl.createPrivacy(['1'], 'Bekannter', {profile: true, image: true, profileData: true, contacts: true, pinwall: true});
            dbDsl.createContactConnection('1', '2', 'Freund', startTime - 1000);

            dbDsl.createThread('1', [{userId: '1', lastTimeVisited: startTime - 500}, {userId: '2', lastTimeVisited: startTime - 400}]);
            dbDsl.createMessages('1', [{userId: '1', messageAdded: startTime - 299, text: 'message1'},
                {userId: '2', messageAdded: startTime - 400, text: 'message2'},
                {userId: '2', messageAdded: startTime - 600, text: 'message3'},
                {userId: '1', messageAdded: startTime - 700, text: 'message4'}]);

            dbDsl.createThread('2', [{userId: '1', lastTimeVisited: startTime - 300}, {userId: '3', lastTimeVisited: startTime - 400}]);
            dbDsl.createMessages('2', [{userId: '3', messageAdded: startTime - 299, text: 'message1'}]);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get user info - Return a 200', function () {
        let requestAgent;
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return db.cypher().match("(user:User {userId: '1'})").set("user", {lastLogin: startTime - 5000}).end().send();
        }).then(function () {
            return requestHandler.get('/api/user/userInfo', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);
            res.body.userId.should.equal('1');
            res.body.name.should.equal('user Meier');
            res.body.profileImage.should.equal('profileImage/1/thumbnail.jpg');
            res.body.profileImagePreview.should.equal('profileImage/1/profilePreview.jpg');
            res.body.email.should.equal('user@irgendwo.ch');
            res.body.contactStatistic.length.should.equal(2);
            res.body.contactStatistic[0].type.should.equal('Freund');
            res.body.contactStatistic[0].count.should.equal(1);
            res.body.contactStatistic[1].type.should.equal('Bekannter');
            res.body.contactStatistic[1].count.should.equal(0);
            res.body.totalUnreadMessages.should.equal(2);

            return db.cypher().match("(user:User {userId: '1'})")
                .return('user').end().send();
        }).then(function (user) {
            user[0].user.lastLogin.should.equals(startTime - 5000);
        });
    });

    it('Getting user info resets the last login value - Return a 200', function () {
        let requestAgent;
        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function (agent) {
            requestAgent = agent;
            return db.cypher().match("(user:User {userId: '1'})").set("user", {lastLogin: startTime - 86500}).end().send();
        }).then(function () {
            return requestHandler.get('/api/user/userInfo', requestAgent);
        }).then(function (res) {
            res.status.should.equal(200);

            return db.cypher().match("(user:User {userId: '1'})")
                .return('user').end().send();
        }).then(function (user) {
            user[0].user.lastLogin.should.be.at.least(startTime);
            user[0].user.previousLastLogin.should.equals(startTime - 86500);
        });
    });
});
