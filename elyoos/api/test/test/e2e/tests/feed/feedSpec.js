'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get the public feed', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {});
        dbDsl.createCommitment('100', {
            adminId: '2', topics: ['Spiritual', 'Education'], language: 'de', created: 400, modified: 606, title: 'Test Commitment',
            website: 'https://www.example.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('101', {
            adminId: '2', topics: ['Spiritual', 'Education'], language: 'en', created: 400, modified: 606, title: 'Test Commitment2',
            website: 'https://www.example2.org/', regions: ['region-1']
        });
        dbDsl.createCommitmentEvent({commitmentId: '100', eventId: '22', created: 777,
            startDate: startTime - 100, endDate: startTime + 200, region: 'region-1'});
        dbDsl.createCommitmentEvent({commitmentId: '100', eventId: '23', created: 778,
            startDate: startTime - 101, endDate: startTime + 199, region: 'region-1'});
        dbDsl.createCommitmentEvent({commitmentId: '100', eventId: '24',created: 888,
            startDate: startTime - 300, endDate: startTime - 200, region: 'region-1'});
        dbDsl.createCommitmentEvent({commitmentId: '101', eventId: '25',created: 999,
            startDate: startTime - 100, endDate: startTime + 200, region: 'region-1'});

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '2', questionId:'1', answer: 'Answer', created: 600,
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '4', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'description2',
            topics: ['Health'], language: 'de', created: 602,
        });
        dbDsl.createYoutubeAnswer('7', {creatorId: '2', questionId: '2', created: 603, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'});
        dbDsl.createLinkAnswer('8', {creatorId: '2', questionId: '2', created: 604, pageType: 'article', hasPreviewImage: true,
            link: 'https://www.example.org/blog/1224'});
        dbDsl.createCommitmentAnswer('9', {
            creatorId: '2', questionId: '2', commitmentId: '100', created: 605, description: 'commitmentDescription'
        });
        dbDsl.createQuestion('3', {
            creatorId: '3', question: 'Das ist eine Frage3', description: 'description3',
            topics: ['Health'], language: 'en', created: 602,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get question feed (only questions)', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed/', {language: 'de'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(2);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].description.should.equals('description2');
        res.body.feed[0].descriptionHtml.should.equals('description2');
        res.body.feed[0].created.should.equals(602);
        res.body.feed[0].numberOfAnswers.should.equals(3);
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.name.should.equals('user Meier3');
        res.body.feed[0].user.slug.should.equals('user-meier3');
        res.body.feed[0].user.userImage.should.equals('profileImage/3/thumbnail.jpg');

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].questionId.should.equals('1');
        res.body.feed[1].question.should.equals('Das ist eine Frage');
        res.body.feed[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[1].description.should.equals('Test elyoos.org change the world');
        res.body.feed[1].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.feed[1].created.should.equals(500);
        res.body.feed[1].numberOfAnswers.should.equals(2);
        res.body.feed[1].user.userId.should.equals('3');
        res.body.feed[1].user.name.should.equals('user Meier3');
        res.body.feed[1].user.slug.should.equals('user-meier3');
        res.body.feed[1].user.userImage.should.equals('profileImage/3/thumbnail.jpg');
    });

    it('Get question feed (only commitment)', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed', {typeFilter: 'commitment', language: 'de'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment100Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/460x460/title.jpg?v=606`);
        res.body.feed[0].created.should.equals(400);
        res.body.feed[0].regions.length.should.equals(1);
        res.body.feed[0].regions.should.include('region-1');
        res.body.feed[0].user.userId.should.equals('2');
        res.body.feed[0].user.name.should.equals('user Meier2');
        res.body.feed[0].user.slug.should.equals('user-meier2');
        res.body.feed[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
    });

    it('Get question feed (only events)', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed', {typeFilter: 'event', language: 'de'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(2);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Event');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].commitmentTitle.should.equals('Test Commitment');
        res.body.feed[0].eventId.should.equals('23');
        res.body.feed[0].title.should.equals('event23Title');
        res.body.feed[0].description.should.equals('event23Description');
        res.body.feed[0].region.should.equals('region-1');
        res.body.feed[0].location.should.equals('event23Location');
        res.body.feed[0].startDate.should.equals(startTime - 101);
        res.body.feed[0].endDate.should.equals(startTime + 199);

        res.body.feed[1].type.should.equals('Event');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].commitmentId.should.equals('100');
        res.body.feed[1].commitmentSlug.should.equals('test-commitment');
        res.body.feed[1].commitmentTitle.should.equals('Test Commitment');
        res.body.feed[1].eventId.should.equals('22');
        res.body.feed[1].title.should.equals('event22Title');
        res.body.feed[1].description.should.equals('event22Description');
        res.body.feed[1].region.should.equals('region-1');
        res.body.feed[1].location.should.equals('event22Location');
        res.body.feed[1].startDate.should.equals(startTime - 100);
        res.body.feed[1].endDate.should.equals(startTime + 200);
    });
});
