'use strict';

let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let eMail = require('dumonda-me-server-lib').eMail;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let moment = require('moment');
let sinon = require('sinon');

describe('Integration Tests for request to register a new user', function () {

    let sandbox;

    beforeEach(async function () {
        sandbox = sinon.sandbox.create();
        await dbDsl.init(2);
        dbDsl.setUserEmail('1', {email: 'USER@irgendWo.ch'});
        await dbDsl.sendToDb();
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Start a register request for a valid new user', async function () {
        let newUser = {
            email: 'Climberwoodi@Gmx.ch',
            language: 'de',
            forename: 'user',
            surname: 'Waldvogel',
            password: '12345678',
            response: '12'
        }, startTime = Math.floor(moment.utc().valueOf() / 1000);
        let stubSendEMail = sandbox.stub(eMail, 'sendEMail');
        stubSendEMail.resolves({});

        let res = await requestHandler.post('/api/register', newUser);
        res.status.should.equal(200);
        let user = await db.cypher().match("(user:UserRegisterRequest {email: 'Climberwoodi@Gmx.ch'})")
            .return(`user.userId AS userId, user.name AS name, user.forename AS forename, user.surname AS surname, 
                user.registerDate AS registerDate, user.language AS language,
                user.emailNormalized AS emailNormalized, user.linkId AS linkId`)
            .end().send();
        user.length.should.equals(1);
        user[0].name.should.equals('user Waldvogel');
        user[0].forename.should.equals(newUser.forename);
        user[0].surname.should.equals(newUser.surname);
        user[0].emailNormalized.should.equals('climberwoodi@gmx.ch');
        user[0].language.should.equals('de');
        user[0].registerDate.should.be.at.least(startTime);

        stubSendEMail.calledWith("registerUserRequest", {link: `${process.env.DUMONDA_ME_DOMAIN}register/verify/${user[0].linkId}`},
            'de', 'Climberwoodi@Gmx.ch').should.be.true;

        await requestHandler.logout();
    });

    it('Register a user for a email does already exists fails - Return 400', function () {
        let newUser = {
            email: 'user@irgendwo.ch',
            language: 'de',
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
            language: 'de',
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
            language: 'de',
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
            language: 'en',
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
})
;
