'use strict';

let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');

describe('Integration Tests for changing password of a user', function () {

    let startTime;

    beforeEach(function () {

        return db.clearDatabase().then(function () {
            let commands = [];
            startTime = Math.floor(moment.utc().valueOf() / 1000);

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', emailNormalized: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '1'})").end().getCommand());
            return db.cypher().match("(u:User {userId: '1'})")
                .create("(u)-[:HAS_PRIVACY_NO_CONTACT]->(:Privacy {profile: false, image: false})")
                .end({}).send(commands);

        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Change the password', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/password', {
            actualPassword: '1',
            newPassword: 'abzBzae1'
        });
        res.status.should.equal(200);
        await requestHandler.logout();
        res = await requestHandler.login({
            'username': 'user@irgendwo.ch',
            'password': 'abzBzae1'
        });
        res.status.should.equal(200);
    });

    it('Change the password fails because actual password is wrong', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/password', {
            actualPassword: '2',
            newPassword: 'abz1Bzae'
        });
        res.status.should.equal(400);
    });

    it('Change the password fails because capital letter is missing', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/password', {
            actualPassword: '1',
            newPassword: 'abz1bzae'
        });
        res.status.should.equal(400);
    });

    it('Change the password fails because number is missing', async function () {
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/password', {
            actualPassword: '1',
            newPassword: 'abzvBzae'
        });
        res.status.should.equal(400);
    });
});
