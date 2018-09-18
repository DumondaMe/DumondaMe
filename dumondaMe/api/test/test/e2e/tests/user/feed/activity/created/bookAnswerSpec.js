'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed for created book answers', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
        dbDsl.createRegion('region-2', {de: 'region2De', en: 'region2En'});
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['topic1', 'topic3'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '3', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Created book answer', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
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
        res.body.feed[0].user.userId.should.equals('3');
        res.body.feed[0].user.name.should.equals('user Meier3');
        res.body.feed[0].user.slug.should.equals('user-meier3');
        res.body.feed[0].user.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Created book answer from user in trust circle', async function () {
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Created book answer is not shown because user ist not in trust circle', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Created book answer is within filter topics', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic1']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Question');
    });

    it('Sub topic of created book answer is within filter topics', async function () {
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic11', descriptionDe: 'topic11De', descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic11', topicId: 'topic111', descriptionDe: 'topic111De', descriptionEn: 'topic111En'
        });
        dbDsl.createQuestion('2', {
            creatorId: '2', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world2',
            topics: ['topic111'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createBookAnswer('7', {
            creatorId: '3', questionId: '2', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic2']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('7');
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].questionId.should.equals('2');
    });

    it('Created book answer is not within filter topics', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic2']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Created book answer is within filter topics and creator is in trust circle', async function () {
        dbDsl.createContactConnection('1', '3');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic1'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Sub topic of created book answer is within filter topics and creator is in trust circle', async function () {
        dbDsl.createContactConnection('1', '5');
        dbDsl.createSubTopic({
            parentTopicId: 'topic2', topicId: 'topic11', descriptionDe: 'topic11De', descriptionEn: 'topic11En'
        });
        dbDsl.createSubTopic({
            parentTopicId: 'topic11', topicId: 'topic111', descriptionDe: 'topic111De', descriptionEn: 'topic111En'
        });
        dbDsl.createQuestion('2', {
            creatorId: '4', question: 'Das ist eine Frage2', description: 'Test elyoos.org change the world2',
            topics: ['topic111'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createBookAnswer('7', {
            creatorId: '5', questionId: '2', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic2'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('7');
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Created book answer is not within filter topics but creator is in trust circle', async function () {
        dbDsl.createContactConnection('1', '3');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic4'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Created book answer is within filter topics but creator is not in trust circle', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic1'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Created book answer is within question marked as interested by the user (filter ty topics)', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic2'], showInterested: true
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Created book answer is within question marked as interested by the user (filter by trust circle)', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1, showInterested: true});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Watching a question does not duplicate created book answer (trust circle and interested)', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});
        dbDsl.createContactConnection('1', '3');

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1, showInterested: true});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
    });

    it('Watching a question does not duplicate created book answer (topic and interested)', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic1'], showInterested: true});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].questionId.should.equals('1');
    });

    it('Show answers created by the user', async function () {
        dbDsl.createBookAnswer('21', {
            creatorId: '1', questionId: '1', created: 777, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('21');
        res.body.feed[0].user.isTrustUser.should.equals(false);
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
    });

    it('Get only created books', async function () {
        dbDsl.createTextAnswer('5', {
            creatorId: '6', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createYoutubeAnswer('7', {
            creatorId: '2', questionId: '1', created: 603, idOnYoutube: '00zxopGPYW4',
            link: 'https://www.youtube.com/watch?v=00zxopGPYW4', linkEmbed: 'https://www.youtube.com/embed/00zxopGPYW4'
        });
        dbDsl.createLinkAnswer('8', {
            creatorId: '1', questionId: '1', created: 604, pageType: 'article', hasPreviewImage: true,
            link: 'https://www.example.org/blog/1224'
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], typeFilter: 'Book'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('created');
        res.body.feed[0].answerId.should.equals('6');
    });
});
