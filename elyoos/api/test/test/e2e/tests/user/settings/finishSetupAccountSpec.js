'use strict';

let requestHandler = require('elyoos-server-test-util').requestHandler;
let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let moment = require('moment');

describe('Integration Tests for finish account setup', function () {

    let startTime;

    beforeEach(function () {

        return dbDsl.init(1).then(function () {
            startTime = Math.floor(moment.utc().valueOf() / 1000);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Setup of account finished', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/settings/finishSetupAccount', {});
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(user:User {userId: '1'})`)
                .return('user').end().send();
        }).then(function (user) {
            user[0].user.lastSetupAccount.should.at.least(startTime);
        });
    });
});
