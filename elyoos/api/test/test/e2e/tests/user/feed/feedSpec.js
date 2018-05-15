'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get feed of the user', function () {

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

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['Spiritual', 'Education'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createTextAnswer('5', {
            creatorId: '6', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '7', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world',
            topics: ['Health'], language: 'de', created: 602,
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '2', questionId: '2', created: 603, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'
        });
        dbDsl.createLinkAnswer('8', {
            creatorId: '2', questionId: '2', created: 604, pageType: 'article', hasPreviewImage: true,
            link: 'https://www.example.org/blog/1224'
        });
        dbDsl.createCommitmentAnswer('9', {
            creatorId: '2', questionId: '2', commitmentId: '100', created: 605, description: 'commitmentDescription'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get empty feed (no filter)', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(0);
        res.body.feed.length.should.equals(0);
    });

    it('Newly created answers to questions the user watches', async function () {
        dbDsl.watchQuestion({questionId: '2', userId: '1'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(3);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('CommitmentAnswer');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('9');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitmentDescription');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/120x120/title.jpg?v=606`);
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].created.should.equals(605);
        res.body.feed[0].creator.userId.should.equals('2');
        res.body.feed[0].creator.name.should.equals('user Meier2');
        res.body.feed[0].creator.slug.should.equals('user-meier2');

        res.body.feed[1].type.should.equals('Link');
        res.body.feed[1].pageType.should.equals('article');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].answerId.should.equals('8');
        res.body.feed[1].title.should.equals('link8Title');
        res.body.feed[1].description.should.equals('link8Description');
        res.body.feed[1].link.should.equals('https://www.example.org/blog/1224');
        res.body.feed[1].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/8/120x120/preview.jpg`);
        res.body.feed[1].questionId.should.equals('2');
        res.body.feed[1].question.should.equals('Das ist eine Frage2');
        res.body.feed[1].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[1].created.should.equals(604);
        res.body.feed[1].creator.userId.should.equals('2');
        res.body.feed[1].creator.name.should.equals('user Meier2');
        res.body.feed[1].creator.slug.should.equals('user-meier2');

        res.body.feed[2].type.should.equals('Youtube');
        res.body.feed[2].action.should.equals('created');
        res.body.feed[2].answerId.should.equals('7');
        res.body.feed[2].title.should.equals('youtube7Title');
        res.body.feed[2].description.should.equals('youtube7Description');
        res.body.feed[2].idOnYoutube.should.equals('00zxopGPYW4');
        res.body.feed[2].linkEmbed.should.equals('https://www.youtube.com/embed/00zxopGPYW4');
        res.body.feed[2].link.should.equals('https://www.youtube.com/watch?v=00zxopGPYW4');
        res.body.feed[2].questionId.should.equals('2');
        res.body.feed[2].question.should.equals('Das ist eine Frage2');
        res.body.feed[2].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[2].created.should.equals(603);
        res.body.feed[2].creator.userId.should.equals('2');
        res.body.feed[2].creator.name.should.equals('user Meier2');
        res.body.feed[2].creator.slug.should.equals('user-meier2');
    });

    it('Newly created answers by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '6');
        dbDsl.createContactConnection('1', '7');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(2);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].title.should.equals('book6Title');
        res.body.feed[0].description.should.equals('book6Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/6/120x250/preview.jpg`);
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(601);
        res.body.feed[0].creator.userId.should.equals('7');
        res.body.feed[0].creator.name.should.equals('user Meier7');
        res.body.feed[0].creator.slug.should.equals('user-meier7');

        res.body.feed[1].type.should.equals('Text');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].answerId.should.equals('5');
        res.body.feed[1].answer.should.equals('Answer');
        res.body.feed[1].questionId.should.equals('1');
        res.body.feed[1].question.should.equals('Das ist eine Frage');
        res.body.feed[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[1].created.should.equals(600);
        res.body.feed[1].creator.userId.should.equals('6');
        res.body.feed[1].creator.name.should.equals('user Meier6');
        res.body.feed[1].creator.slug.should.equals('user-meier6');
    });

    it('Newly created questions by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].description.should.equals('Test elyoos.org change the world');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.feed[0].created.should.equals(602);
        res.body.feed[0].numberOfAnswers.should.equals(3);
        res.body.feed[0].creator.userId.should.equals('3');
        res.body.feed[0].creator.name.should.equals('user Meier3');
        res.body.feed[0].creator.slug.should.equals('user-meier3');
    });

    it('A user from the Trust Circle watches a question', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchQuestion({questionId: '2', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world`);
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].numberOfAnswers.should.equals(3);
        res.body.feed[0].creator.userId.should.equals('9');
        res.body.feed[0].creator.name.should.equals('user Meier9');
        res.body.feed[0].creator.slug.should.equals('user-meier9');
    });

    it('A user from the Trust Circle watches a commitment', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.watchCommitment({commitmentId: '100', userId: '9', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitment100Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/120x120/title.jpg?v=606`);
        res.body.feed[0].regions.length.should.equals(1);
        res.body.feed[0].regions.should.include('region-1');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].creator.userId.should.equals('9');
        res.body.feed[0].creator.name.should.equals('user Meier9');
        res.body.feed[0].creator.slug.should.equals('user-meier9');
    });

    it('Up vote of an answer by users from the Trust Circle', async function () {
        dbDsl.createContactConnection('1', '9');
        dbDsl.upVoteAnswer({userId: '9', answerId: '8', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.totalNumberOfElements.should.equals(1);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Link');
        res.body.feed[0].pageType.should.equals('article');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('8');
        res.body.feed[0].title.should.equals('link8Title');
        res.body.feed[0].description.should.equals('link8Description');
        res.body.feed[0].link.should.equals('https://www.example.org/blog/1224');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/link/8/120x120/preview.jpg`);
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].creator.userId.should.equals('9');
        res.body.feed[0].creator.name.should.equals('user Meier9');
        res.body.feed[0].creator.slug.should.equals('user-meier9');
    });
});
