'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get activity feed for up voted book answers', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(6);
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

    it('Get up voted book answer', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].title.should.equals('book6Title');
        res.body.feed[0].description.should.equals('book6Description');
        res.body.feed[0].imageUrl.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/book/6/120x250/preview.jpg`);
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].numberOfUpVotes.should.equals(1);
        res.body.feed[0].isUpVotedByUser.should.equals(false);
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].user.name.should.equals('user Meier4');
        res.body.feed[0].user.slug.should.equals('user-meier4');
        res.body.feed[0].user.userImage.should.equals('profileImage/4/thumbnail.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        res.body.feed[0].creator.userId.should.equals('3');
        res.body.feed[0].creator.name.should.equals('user Meier3');
        res.body.feed[0].creator.slug.should.equals('user-meier3');
        res.body.feed[0].creator.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.feed[0].creator.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.feed[0].creator.isLoggedInUser.should.equals(false);
        res.body.feed[0].creator.isTrustUser.should.equals(false);

        res.body.feed[1].type.should.equals('Book');
        res.body.feed[1].action.should.equals('created');

        res.body.feed[2].type.should.equals('Question');
        res.body.feed[2].action.should.equals('created');
    });

    it('Only latest up voted book answer', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '1', answerId: '6', created: 998});
        dbDsl.upVoteAnswer({userId: '6', answerId: '6', created: 997});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {guiLanguage: 'de', languages: ['de']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].numberOfUpVotes.should.equals(3);
        res.body.feed[0].isUpVotedByUser.should.equals(true);
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].creator.userId.should.equals('3');

        res.body.feed[1].type.should.equals('Book');
        res.body.feed[1].action.should.equals('created');

        res.body.feed[2].type.should.equals('Question');
        res.body.feed[2].action.should.equals('created');
    });

    it('Get up voted book answer (topics filter)', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic1', 'topic2', 'topic3']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(1);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].creator.userId.should.equals('3');

        res.body.feed[1].type.should.equals('Book');
        res.body.feed[1].action.should.equals('created');

        res.body.feed[2].type.should.equals('Question');
        res.body.feed[2].action.should.equals('created');
    });

    it('Only latest up voted book answer (topics filter)', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '5', answerId: '6', created: 998});
        dbDsl.upVoteAnswer({userId: '6', answerId: '6', created: 997});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic1', 'topic2', 'topic3']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(3);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].creator.userId.should.equals('3');

        res.body.feed[1].type.should.equals('Book');
        res.body.feed[1].action.should.equals('created');

        res.body.feed[2].type.should.equals('Question');
        res.body.feed[2].action.should.equals('created');
    });

    it('Get up voted book answer (trust circle filter)', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.createContactConnection('1', '4');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(1);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].creator.userId.should.equals('3');
    });

    it('Only latest up voted book answer (trust circle filter)', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '1', answerId: '6', created: 998});
        dbDsl.upVoteAnswer({userId: '6', answerId: '6', created: 997});
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '6');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(3);
        res.body.feed[0].isUpVotedByUser.should.equals(true);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].creator.userId.should.equals('3');
    });

    it('Get up voted book answer (trust circle and topics filter)', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.createContactConnection('1', '4');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1, topics: ['topic1', 'topic2', 'topic3']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(1);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].creator.userId.should.equals('3');
    });

    it('Only latest up voted book answer  (trust circle and topics filter)', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '5', answerId: '6', created: 998});
        dbDsl.upVoteAnswer({userId: '6', answerId: '6', created: 997});
        dbDsl.createContactConnection('1', '4');
        dbDsl.createContactConnection('1', '5');
        dbDsl.createContactConnection('1', '6');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1, topics: ['topic1', 'topic2', 'topic3']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].numberOfUpVotes.should.equals(3);
        res.body.feed[0].answerId.should.equals('6');
        res.body.feed[0].user.userId.should.equals('4');
        res.body.feed[0].creator.userId.should.equals('3');
    });

    it('Up voted book answer is not shown because of topics filter', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], topics: ['topic4']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Up voted book answer is not shown because user is not in trust circle', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.createContactConnection('1', '5');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Up voted book answer is not shown because user is in trust circle but not in topics ', async function () {
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.createContactConnection('1', '4');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], trustCircle: 1, topics: ['topic4']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Get only up voted books', async function () {
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
        dbDsl.upVoteAnswer({userId: '4', answerId: '5', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], typeFilter: 'Book'});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');

        res.body.feed[1].type.should.equals('Book');
        res.body.feed[1].action.should.equals('created');
    });

    it('Get only up voted books (topics filter)', async function () {
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
        dbDsl.upVoteAnswer({userId: '4', answerId: '5', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], typeFilter: 'Book', topics: ['topic1']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');

        res.body.feed[1].type.should.equals('Book');
        res.body.feed[1].action.should.equals('created');
    });

    it('Get only up voted books (trust circle filter)', async function () {
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
        dbDsl.upVoteAnswer({userId: '4', answerId: '5', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        dbDsl.createContactConnection('1', '4');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], typeFilter: 'Book', trustCircle: 1});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');
    });

    it('Get only up voted books (trust circle and topic filter)', async function () {
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
        dbDsl.upVoteAnswer({userId: '4', answerId: '5', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '6', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '7', created: 999});
        dbDsl.upVoteAnswer({userId: '4', answerId: '8', created: 999});
        dbDsl.createContactConnection('1', '4');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity',
            {guiLanguage: 'de', languages: ['de'], typeFilter: 'Book', trustCircle: 1, topics: ['topic1', 'topic3']});
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Book');
        res.body.feed[0].action.should.equals('upVote');
        res.body.feed[0].answerId.should.equals('6');
    });
});
