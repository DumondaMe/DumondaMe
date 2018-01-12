'use strict';

let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');
let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let sinon = require('sinon');

describe('Integration Tests for request to register a new user', function () {

    beforeEach(function () {

        return dbDsl.init(2).then(function () {
            dbDsl.setUserEmail('1', {email: 'USER@irgendWo.ch'});
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Start a register request for a valid new user - Return 200', function () {
        let newUser = {
            email: 'Climberwoodi@Gmx.ch',
            forename: 'user',
            surname: 'Waldvogel',
            password: '12345678',
            response: '12'
        }, startTime = Math.floor(moment.utc().valueOf() / 1000);

        return requestHandler.post('/api/register', newUser).then(function (res) {
            res.status.should.equal(200);
            stubEmailQueue.createImmediatelyJob.calledWith("registerUserRequest", {
                email: 'Climberwoodi@Gmx.ch',
                linkId: sinon.match.any
            }).should.be.true;
            return db.cypher().match("(user:UserRegisterRequest {email: 'Climberwoodi@Gmx.ch'})")
                .return(`user.userId AS userId, user.name AS name, user.forename AS forename, user.surname AS surname, 
                user.registerDate AS registerDate, user.latitude AS latitude, user.longitude AS longitude,
                user.emailNormalized AS emailNormalized`)
                .end().send();
        }).then(function (user) {
            user.length.should.equals(1);
            user[0].name.should.equals('user Waldvogel');
            user[0].forename.should.equals(newUser.forename);
            user[0].surname.should.equals(newUser.surname);
            user[0].latitude.should.equals(0);
            user[0].longitude.should.equals(0);
            user[0].emailNormalized.should.equals('climberwoodi@gmx.ch');
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

    it('Register a user for a email does already exists fails (user with capital letters)- Return 400', function () {
        let newUser = {
            email: 'uSer@irgendwo.ch',
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

    it('Register a user for a email does already exists fails (domain with capital letters)- Return 400', function () {
        let newUser = {
            email: 'user@irGendwo.ch',
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

    it('Register a user for a email does already exists fails (all with capital letters)- Return 400', function () {
        let newUser = {
            email: 'USER@IRGENDWO.CH',
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
