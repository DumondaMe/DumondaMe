'use strict';

let libUser = require('elyoos-server-lib').user();
let requestHandler = require('elyoos-server-test-util').requestHandler;
let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let should = require('chai').should();

describe('Integration Tests setting user location', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');
        return dbDsl.init(1).then(function () {
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Setting user location', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.post('/api/user/settings/userLocation',
                {description: 'Zürich', latitude: 47.3768871, longitude: 8.5416941});
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(user:User {userId: '1'})`)
                .return('user').end().send();
        }).then(function (user) {
            user[0].user.userLocationDescription.should.equal('Zürich');
            user[0].user.latitude.should.equal(47.3768871);
            user[0].user.longitude.should.equal(8.5416941);
        });
    });

    it('Delete user location', function () {
        return requestHandler.login(users.validUser).then(function () {
            return requestHandler.del('/api/user/settings/userLocation', {});
        }).then(function (res) {
            res.status.should.equal(200);
            return db.cypher().match(`(user:User {userId: '1'})`)
                .return('user').end().send();
        }).then(function (user) {
            should.not.exist(user[0].user.userLocationDescription);
            user[0].user.latitude.should.equal(0);
            user[0].user.longitude.should.equal(0);
        });
    });
});
