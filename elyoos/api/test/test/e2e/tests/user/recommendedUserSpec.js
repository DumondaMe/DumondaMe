'use strict';

let users = require('elyoos-server-test-util').user;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let db = require('elyoos-server-test-util').db;

describe('Integration Tests for change setting of recommended user feature', function () {

    beforeEach(function () {
        return dbDsl.init(0);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Set recommending user on home screen to false - Return a 200', function () {

        return dbDsl.sendToDb().then(function () {
            return requestHandler.login(users.validUser);
        }).then(function () {
            return requestHandler.post('/api/user/recommendedUser', {showOnHomeScreen: false});
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match("(user:User {userId: '1'})").return(`user`).end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].user.showUserRecommendationOnHome.should.equals(false);
        });
    });
});
