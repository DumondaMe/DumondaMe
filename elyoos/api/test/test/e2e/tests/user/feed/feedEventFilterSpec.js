'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get feed of the user with event filter', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(10);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {});
        dbDsl.createCommitment('100', {
            adminId: '2',
            topics: ['Spiritual', 'Education'],
            language: 'de',
            created: 400,
            modified: 606,
            title: 'Test Commitment',
            website: 'https://www.example.org/',
            regions: ['region-1']
        });

        dbDsl.createCommitmentEvent({commitmentId: '100', eventId: '22', created: 777,
            startDate: startTime - 100, endDate: startTime + 200, region: 'region-1'});
        dbDsl.createCommitmentEvent({commitmentId: '100', eventId: '23', created: 778,
            startDate: startTime - 200, endDate: startTime - 100, region: 'region-1'});

        dbDsl.createContactConnection('1', '4');

        dbDsl.createQuestion('1', {
            creatorId: '4', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '5', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createQuestion('2', {
            creatorId: '6', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['Health'], language: 'de', created: 602,
        });
        dbDsl.watchQuestion({questionId: '1', userId: '1'});
        dbDsl.createContactConnection('1', '5');
        dbDsl.watchCommitment({commitmentId: '100', userId: '1'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Newly created events of an commitment the user watches', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed', {typeFilter: 'event'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].commitmentTitle.should.equals('Test Commitment');
        res.body.feed[0].eventId.should.equals('22');
        res.body.feed[0].created.should.equals(777);
        res.body.feed[0].title.should.equals('event22Title');
        res.body.feed[0].description.should.equals('event22Description');
        res.body.feed[0].region.should.equals('region-1');
        res.body.feed[0].location.should.equals('event22Location');
        res.body.feed[0].startDate.should.equals(startTime - 100);
        res.body.feed[0].endDate.should.equals(startTime + 200);
    });
});
