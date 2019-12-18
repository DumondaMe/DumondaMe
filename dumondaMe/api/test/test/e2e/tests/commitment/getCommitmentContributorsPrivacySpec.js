'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Contributors of commitment privacy settings', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(3);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {de: 'Region1De', en: 'Region1En'});;

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['topic1'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1']
        });

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Admin visibility is dumondaMe internal and user is not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1', language: 'de'});
        res.status.should.equal(200);
        res.body.commitmentId.should.equals('1');

        res.body.contributors.length.should.equals(0);
    });

    it('Admin visibility is contact only and user is not logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1', language: 'de'});
        res.status.should.equal(200);
        res.body.commitmentId.should.equals('1');

        res.body.contributors.length.should.equals(0);
    });

    it('Admin visibility is dumondaMe internal and user is logged in', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'publicEl'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1', language: 'de'});
        res.status.should.equal(200);
        res.body.commitmentId.should.equals('1');

        res.body.contributors.length.should.equals(1);
        res.body.contributors[0].userId.should.equals('2');
        res.body.contributors[0].name.should.equals('user Meier2');
        res.body.contributors[0].slug.should.equals('user-meier2');
        res.body.contributors[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.contributors[0].isLoggedInUser.should.equals(false);
    });

    it('Admin visibility is contact only and user is logged in and contact of admin', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        dbDsl.createContactConnection('2', '1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1', language: 'de'});
        res.status.should.equal(200);
        res.body.commitmentId.should.equals('1');

        res.body.contributors.length.should.equals(1);
        res.body.contributors[0].userId.should.equals('2');
        res.body.contributors[0].name.should.equals('user Meier2');
        res.body.contributors[0].slug.should.equals('user-meier2');
        res.body.contributors[0].profileUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.contributors[0].isLoggedInUser.should.equals(false);
    });

    it('Admin visibility is contact only and user is logged ', async function () {
        dbDsl.setUserPrivacy('2', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/commitment', {commitmentId: '1', language: 'de'});
        res.status.should.equal(200);
        res.body.commitmentId.should.equals('1');

        res.body.contributors.length.should.equals(0);
    });

});
