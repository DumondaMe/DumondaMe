'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Getting users who watches a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(24);
        await requestHandler.logout();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world',
            topics: ['Spiritual', 'Education'], language: 'de', modified: 700
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('When logged in and no watches', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('When logged in and no user in trust circle', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '3', created: 999});
        dbDsl.watchQuestion({questionId: '1', userId: '4', created: 998});
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 997});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(3);
        res.body.users[0].userId.should.equals('3');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].name.should.equals('user Meier3');
        res.body.users[0].slug.should.equals('user-meier3');
        res.body.users[0].profileUrl.should.equals('profileImage/3/thumbnail.jpg');
        res.body.users[0].isPersonOfTrust.should.equals(false);

        res.body.users[1].userId.should.equals('4');
        res.body.users[1].date.should.equals(998);
        res.body.users[1].name.should.equals('user Meier4');
        res.body.users[1].slug.should.equals('user-meier4');
        res.body.users[1].profileUrl.should.equals('profileImage/4/thumbnail.jpg');
        res.body.users[1].isPersonOfTrust.should.equals(false);

        res.body.users[2].userId.should.equals('5');
        res.body.users[2].date.should.equals(997);
        res.body.users[2].name.should.equals('user Meier5');
        res.body.users[2].slug.should.equals('user-meier5');
        res.body.users[2].profileUrl.should.equals('profileImage/5/thumbnail.jpg');
        res.body.users[2].isPersonOfTrust.should.equals(false);
    });

    it('When logged in and users in trust circle', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '3', created: 999});
        dbDsl.watchQuestion({questionId: '1', userId: '4', created: 998});
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 997});

        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '5');
        dbDsl.createContactConnection('3', '1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(3);

        res.body.users[0].userId.should.equals('4');
        res.body.users[0].date.should.equals(998);
        res.body.users[0].isPersonOfTrust.should.equals(true);

        res.body.users[1].userId.should.equals('5');
        res.body.users[1].date.should.equals(997);
        res.body.users[1].isPersonOfTrust.should.equals(true);

        res.body.users[2].userId.should.equals('3');
        res.body.users[2].date.should.equals(999);
        res.body.users[2].isPersonOfTrust.should.equals(false);
    });

    it('When public', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});
        dbDsl.watchQuestion({questionId: '1', userId: '4', created: 998});
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 997});
        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(3);

        res.body.users[0].userId.should.equals('1');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].isPersonOfTrust.should.equals(false);

        res.body.users[1].userId.should.equals('4');
        res.body.users[1].date.should.equals(998);
        res.body.users[1].isPersonOfTrust.should.equals(false);

        res.body.users[2].userId.should.equals('5');
        res.body.users[2].date.should.equals(997);
        res.body.users[2].isPersonOfTrust.should.equals(false);
    });

    it('Show anonymous user when privacy to contact only and no contact relationship exists', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '3', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'contactOnly'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);

        res.body.users[0].isAnonymous.should.equals(true);
        res.body.users[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
        res.body.users[0].numberOfAnonymous.should.equals(1);
    });

    it('Show user when privacy to contact only and contact relationship exists', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '3', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'contactOnly'});
        dbDsl.createContactConnection('3', '1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);

        res.body.users[0].userId.should.equals('3');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].isPersonOfTrust.should.equals(false);
    });

    it('Show anonymous user when privacy to elyoos only and user is not logged in', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '3', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);

        res.body.users[0].isAnonymous.should.equals(true);
        res.body.users[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
        res.body.users[0].numberOfAnonymous.should.equals(1);
    });

    it('Show user when privacy to elyoos only and user is logged in', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '3', created: 999});
        dbDsl.setUserPrivacy('3', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);

        res.body.users[0].userId.should.equals('3');
        res.body.users[0].date.should.equals(999);
        res.body.users[0].isPersonOfTrust.should.equals(false);
    });

    it('Do not show the watches of the logged in user', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(0);
    });

    it('Has more is true', async function () {
        for (let index = 3; index < 24; index++) {
            dbDsl.watchQuestion({questionId: '1', userId: `${index}`, created: 999 + index});
        }
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(true);
        res.body.users.length.should.equals(20);
    });

    it('Return only one anonymous user', async function () {
        for (let index = 3; index < 24; index++) {
            dbDsl.watchQuestion({questionId: '1', userId: `${index}`, created: 999 + index});
            dbDsl.setUserPrivacy(`${index}`, {privacyMode: 'contactOnly'});
        }
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/watches', {id: '1', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreUsers.should.equals(false);
        res.body.users.length.should.equals(1);

        res.body.users[0].isAnonymous.should.equals(true);
        res.body.users[0].profileUrl.should.equals('profileImage/default/thumbnail.jpg');
        res.body.users[0].numberOfAnonymous.should.equals(21);
    });
});
