'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get question and answers from public question feed', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createCommitment('100', {
            adminId: '2', topics: ['Spiritual', 'Education'], language: 'de', created: 400, title: 'Test Commitment',
            website: 'https://www.example.org/', regions: ['region-1-1-1']
        });

        dbDsl.createQuestion('1', {
            creatorId: '3', question: 'Das ist eine Frage', description: 'description',
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
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get question feed (all)', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed/public/question');
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(7);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('9');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitmentDescription');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/120x120/title.jpg`);
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].created.should.equals(605);
        res.body.feed[0].creator.userId.should.equals('2');
        res.body.feed[0].creator.name.should.equals('user Meier2');
        res.body.feed[0].creator.slug.should.equals('user-meier2');
        res.body.feed[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

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
        res.body.feed[1].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

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
        res.body.feed[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.feed[3].type.should.equals('Question');
        res.body.feed[3].action.should.equals('created');
        res.body.feed[3].questionId.should.equals('2');
        res.body.feed[3].question.should.equals('Das ist eine Frage2');
        res.body.feed[3].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[3].description.should.equals('description2');
        res.body.feed[3].created.should.equals(602);
        res.body.feed[3].numberOfAnswers.should.equals(3);
        res.body.feed[3].creator.userId.should.equals('3');
        res.body.feed[3].creator.name.should.equals('user Meier3');
        res.body.feed[3].creator.slug.should.equals('user-meier3');
        res.body.feed[3].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.feed[4].type.should.equals('Book');
        res.body.feed[4].action.should.equals('created');
        res.body.feed[4].answerId.should.equals('6');
        res.body.feed[4].title.should.equals('book6Title');
        res.body.feed[4].description.should.equals('book6Description');
        res.body.feed[4].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/6/120x250/preview.jpg`);
        res.body.feed[4].questionId.should.equals('1');
        res.body.feed[4].question.should.equals('Das ist eine Frage');
        res.body.feed[4].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[4].created.should.equals(601);
        res.body.feed[4].creator.userId.should.equals('4');
        res.body.feed[4].creator.name.should.equals('user Meier4');
        res.body.feed[4].creator.slug.should.equals('user-meier4');
        res.body.feed[4].creator.thumbnailUrl.should.equals('profileImage/4/thumbnail.jpg');

        res.body.feed[5].type.should.equals('Text');
        res.body.feed[5].action.should.equals('created');
        res.body.feed[5].answerId.should.equals('5');
        res.body.feed[5].answer.should.equals('Answer');
        res.body.feed[5].questionId.should.equals('1');
        res.body.feed[5].question.should.equals('Das ist eine Frage');
        res.body.feed[5].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[5].created.should.equals(600);
        res.body.feed[5].creator.userId.should.equals('2');
        res.body.feed[5].creator.name.should.equals('user Meier2');
        res.body.feed[5].creator.slug.should.equals('user-meier2');
        res.body.feed[5].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.feed[6].type.should.equals('Question');
        res.body.feed[6].action.should.equals('created');
        res.body.feed[6].questionId.should.equals('1');
        res.body.feed[6].question.should.equals('Das ist eine Frage');
        res.body.feed[6].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[6].description.should.equals('description');
        res.body.feed[6].created.should.equals(500);
        res.body.feed[6].numberOfAnswers.should.equals(2);
        res.body.feed[6].creator.userId.should.equals('3');
        res.body.feed[6].creator.name.should.equals('user Meier3');
        res.body.feed[6].creator.slug.should.equals('user-meier3');
        res.body.feed[6].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
    });

    it('Get question feed (only questions)', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed/public/question', {typeFilter: 'question'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].description.should.equals('description2');
        res.body.feed[0].created.should.equals(602);
        res.body.feed[0].numberOfAnswers.should.equals(3);
        res.body.feed[0].creator.userId.should.equals('3');
        res.body.feed[0].creator.name.should.equals('user Meier3');
        res.body.feed[0].creator.slug.should.equals('user-meier3');
        res.body.feed[0].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].questionId.should.equals('1');
        res.body.feed[1].question.should.equals('Das ist eine Frage');
        res.body.feed[1].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[1].description.should.equals('description');
        res.body.feed[1].created.should.equals(500);
        res.body.feed[1].numberOfAnswers.should.equals(2);
        res.body.feed[1].creator.userId.should.equals('3');
        res.body.feed[1].creator.name.should.equals('user Meier3');
        res.body.feed[1].creator.slug.should.equals('user-meier3');
        res.body.feed[1].creator.thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
    });

    it('Get question feed (only answers)', async function () {
        await dbDsl.sendToDb();
        let res = await requestHandler.get('/api/feed/public/question', {typeFilter: 'answer'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(5);

        res.body.feed[0].type.should.equals('Commitment');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('9');
        res.body.feed[0].commitmentId.should.equals('100');
        res.body.feed[0].commitmentSlug.should.equals('test-commitment');
        res.body.feed[0].title.should.equals('Test Commitment');
        res.body.feed[0].description.should.equals('commitmentDescription');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/100/120x120/title.jpg`);
        res.body.feed[0].questionId.should.equals('2');
        res.body.feed[0].question.should.equals('Das ist eine Frage2');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage2');
        res.body.feed[0].created.should.equals(605);
        res.body.feed[0].creator.userId.should.equals('2');
        res.body.feed[0].creator.name.should.equals('user Meier2');
        res.body.feed[0].creator.slug.should.equals('user-meier2');
        res.body.feed[0].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

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
        res.body.feed[1].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

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
        res.body.feed[2].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');

        res.body.feed[3].type.should.equals('Book');
        res.body.feed[3].action.should.equals('created');
        res.body.feed[3].answerId.should.equals('6');
        res.body.feed[3].title.should.equals('book6Title');
        res.body.feed[3].description.should.equals('book6Description');
        res.body.feed[3].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/6/120x250/preview.jpg`);
        res.body.feed[3].questionId.should.equals('1');
        res.body.feed[3].question.should.equals('Das ist eine Frage');
        res.body.feed[3].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[3].created.should.equals(601);
        res.body.feed[3].creator.userId.should.equals('4');
        res.body.feed[3].creator.name.should.equals('user Meier4');
        res.body.feed[3].creator.slug.should.equals('user-meier4');
        res.body.feed[3].creator.thumbnailUrl.should.equals('profileImage/4/thumbnail.jpg');

        res.body.feed[4].type.should.equals('Text');
        res.body.feed[4].action.should.equals('created');
        res.body.feed[4].answerId.should.equals('5');
        res.body.feed[4].answer.should.equals('Answer');
        res.body.feed[4].questionId.should.equals('1');
        res.body.feed[4].question.should.equals('Das ist eine Frage');
        res.body.feed[4].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[4].created.should.equals(600);
        res.body.feed[4].creator.userId.should.equals('2');
        res.body.feed[4].creator.name.should.equals('user Meier2');
        res.body.feed[4].creator.slug.should.equals('user-meier2');
        res.body.feed[4].creator.thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
    });
});
