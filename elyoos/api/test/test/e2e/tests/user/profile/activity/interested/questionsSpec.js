'use strict';

const dbDsl = require('elyoos-server-test-util').dbDSL;
const users = require('elyoos-server-test-util').user;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const moment = require('moment');

describe('Get activity feed for interested questions for a user', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(11);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});
        dbDsl.createMainTopic({topicId: 'topic3', descriptionDe: 'topic3De', descriptionEn: 'topic3En'});
        dbDsl.createMainTopic({topicId: 'topic4', descriptionDe: 'topic4De', descriptionEn: 'topic4En'});
        dbDsl.createMainTopic({topicId: 'topic5', descriptionDe: 'topic5De', descriptionEn: 'topic5En'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world1',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
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
            topics: ['topic2'], language: 'de', created: 602,
        });
        dbDsl.createQuestion('3', {
            creatorId: '4', question: 'Das ist eine Frage3', description: 'Test elyoos.org change the world3',
            topics: ['topic3', 'topic4', 'topic5'], language: 'en', created: 555,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get interested question for a user', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity', {
            guiLanguage: 'de', languages: ['de'], userId: '5'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://elyoos.org" class="linkified" target="_blank">elyoos.org</a> change the world1`);
        res.body.feed[0].created.should.equals(999);
        res.body.feed[0].numberOfAnswers.should.equals(2);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/5/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        res.body.feed[0].creator.userId.should.equals('2');
        res.body.feed[0].creator.name.should.equals('user Meier2');
        res.body.feed[0].creator.slug.should.equals('user-meier2');
        res.body.feed[0].creator.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.feed[0].creator.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.feed[0].creator.isLoggedInUser.should.equals(false);
        res.body.feed[0].creator.isTrustUser.should.equals(false);
    });

    it('Get interested question for logged in user', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '1', created: 999});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/profile/activity', {
            guiLanguage: 'de', languages: ['de'], userId: '1'
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].user.userId.should.equals('1');
        res.body.feed[0].user.isLoggedInUser.should.equals(true);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        res.body.feed[0].creator.userId.should.equals('2');
        res.body.feed[0].creator.isTrustUser.should.equals(false);
    });
});
