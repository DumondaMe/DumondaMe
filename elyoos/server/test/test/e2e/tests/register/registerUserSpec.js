'use strict';

let libUser = require('elyoos-server-lib').user();
let db = require('elyoos-server-test-util').db;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let sinon = require('sinon');

describe('Integration Tests for request to register a new user', function () {

    beforeEach(function () {

        libUser.removeFromCache('user@irgendwo.ch');

        return db.clearDatabase().then(function () {
            let commands = [];

            commands.push(db.cypher().create("(:User {email: 'user@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user Meier', userId: '0'})").end().getCommand());

            // User 2
            return db.cypher().create("(:User {email: 'user2@irgendwo.ch', password: '$2a$10$JlKlyw9RSpt3.nt78L6VCe0Kw5KW4SPRaCGSPMmpW821opXpMgKAm', name: 'user2 Meier2', userId: '2'})").end().send(commands);
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Start a register request for a valid new user - Return 200', function () {
        let newUser = {
            email: 'climberwoodi@gmx.ch',
            forename: 'user',
            surname: 'Waldvogel',
            password: '12345678',
            response: '12'
        }, startTime = Math.floor(moment.utc().valueOf() / 1000);

        return requestHandler.post('/api/register', newUser).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.calledWith("registerUserRequest", {
                email: 'climberwoodi@gmx.ch',
                linkId: sinon.match.any
            }).should.be.true;
            return db.cypher().match("(user:UserRegisterRequest {email: 'climberwoodi@gmx.ch'})")
                .return(`user.userId AS userId, user.name AS name, user.forename AS forename, user.surname AS surname, user.registerDate AS registerDate`)
                .end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].name.should.equals('user Waldvogel');
            user[0].forename.should.equals(newUser.forename);
            user[0].surname.should.equals(newUser.surname);
            user[0].registerDate.should.be.at.least(startTime);
            return requestHandler.logout();
        });
    });

    it('Register a user for a email does already exists fails - Return 400', function () {
        let newUser = {
            email: 'user@irgendwo.ch',
            forename: 'user',
            surname: 'Waldvogel',
            password: '12345678',
            response: '12'
        };

        return requestHandler.post('/api/register', newUser).then(function (res) {
            res.status.should.equal(400);
            res.body.errorCode.should.equal(2);
        });
    });
});
