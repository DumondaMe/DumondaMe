'use strict';

const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Get activity feed for interested questions', function () {

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
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test dumonda.me change the world1',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        dbDsl.createDefaultAnswer('5', {
            creatorId: '6', questionId: '1', answer: 'Answer', created: 600,
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '7', questionId: '1', created: 601, authors: 'Hans Wurst', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('2', {
            creatorId: '3', question: 'Das ist eine Frage2', description: 'Test dumonda.me change the world',
            topics: ['topic2'], language: 'de', created: 602,
        });
        dbDsl.createQuestion('3', {
            creatorId: '4', question: 'Das ist eine Frage3', description: 'Test dumonda.me change the world3',
            topics: ['topic3', 'topic4', 'topic5'], language: 'en', created: 555,
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get interested question when only timestamp filter is active', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 501});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], timestamp: 505
        });
        res.status.should.equal(200);
        res.body.timestamp.should.equals(505);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.feed[0].created.should.equals(501);
        res.body.feed[0].numberOfAnswers.should.equals(2);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/5/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get interested question of a user from the trust circle', async function () {
        dbDsl.createContactConnection('1', '5');
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 501});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('1');
        res.body.feed[0].question.should.equals('Das ist eine Frage');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.feed[0].created.should.equals(501);
        res.body.feed[0].numberOfAnswers.should.equals(2);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/5/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Not getting interesting question by users not in trust circle', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 399});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });

    it('Get interested question of a user filtered by topics', async function () {
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: 556});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic5', 'topic6']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].question.should.equals('Das ist eine Frage3');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world3`);
        res.body.feed[0].created.should.equals(556);
        res.body.feed[0].numberOfAnswers.should.equals(0);
        res.body.feed[0].numberOfWatches.should.equals(1);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/5/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get a question which is multiple times marked as interested only once', async function () {
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: 558});
        dbDsl.watchQuestion({questionId: '3', userId: '1', created: 557});
        dbDsl.watchQuestion({questionId: '3', userId: '7', created: 556});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], timestamp: 560
        });
        res.status.should.equal(200);
        res.body.timestamp.should.equals(560);
        res.body.feed.length.should.equals(3);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].question.should.equals('Das ist eine Frage3');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world3`);
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].numberOfAnswers.should.equals(0);
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(true);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/5/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);

        res.body.feed[1].type.should.equals('Question');
        res.body.feed[1].action.should.equals('created');
        res.body.feed[1].questionId.should.equals('3');

        res.body.feed[2].type.should.equals('Question');
        res.body.feed[2].action.should.equals('created');
        res.body.feed[2].questionId.should.equals('1');
    });

    it('Get a question which is multiple times marked as interested only once (topics filter)', async function () {
        dbDsl.watchQuestion({questionId: '3', userId: '5', created: 558});
        dbDsl.watchQuestion({questionId: '3', userId: '6', created: 557});
        dbDsl.watchQuestion({questionId: '3', userId: '7', created: 556});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic5', 'topic6']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(2);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].question.should.equals('Das ist eine Frage3');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world3`);
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].numberOfAnswers.should.equals(0);
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('5');
        res.body.feed[0].user.name.should.equals('user Meier5');
        res.body.feed[0].user.slug.should.equals('user-meier5');
        res.body.feed[0].user.userImage.should.equals('profileImage/5/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/5/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(false);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get a question which is multiple times marked as interested only once (trust circle filter)', async function () {
        dbDsl.watchQuestion({questionId: '3', userId: '8', created: 558});
        dbDsl.watchQuestion({questionId: '3', userId: '9', created: 557});
        dbDsl.watchQuestion({questionId: '3', userId: '10', created: 556});
        dbDsl.createContactConnection('1', '8');
        dbDsl.createContactConnection('1', '9');
        dbDsl.createContactConnection('1', '10');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].question.should.equals('Das ist eine Frage3');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world3`);
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].numberOfAnswers.should.equals(0);
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('8');
        res.body.feed[0].user.name.should.equals('user Meier8');
        res.body.feed[0].user.slug.should.equals('user-meier8');
        res.body.feed[0].user.userImage.should.equals('profileImage/8/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/8/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Get a question which is multiple times marked as interested only once (trust circle and topic filter)', async function () {
        dbDsl.watchQuestion({questionId: '3', userId: '8', created: 558});
        dbDsl.watchQuestion({questionId: '3', userId: '9', created: 557});
        dbDsl.watchQuestion({questionId: '3', userId: '10', created: 556});
        dbDsl.createContactConnection('1', '8');
        dbDsl.createContactConnection('1', '9');
        dbDsl.createContactConnection('1', '10');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], trustCircle: 1, topics: ['topic4', 'topic5']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(1);

        res.body.feed[0].type.should.equals('Question');
        res.body.feed[0].action.should.equals('watch');
        res.body.feed[0].questionId.should.equals('3');
        res.body.feed[0].question.should.equals('Das ist eine Frage3');
        res.body.feed[0].questionSlug.should.equals('das-ist-eine-frage3');
        res.body.feed[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world3`);
        res.body.feed[0].created.should.equals(558);
        res.body.feed[0].numberOfAnswers.should.equals(0);
        res.body.feed[0].numberOfWatches.should.equals(3);
        res.body.feed[0].isWatchedByUser.should.equals(false);
        res.body.feed[0].isAdmin.should.equals(false);
        res.body.feed[0].user.userId.should.equals('8');
        res.body.feed[0].user.name.should.equals('user Meier8');
        res.body.feed[0].user.slug.should.equals('user-meier8');
        res.body.feed[0].user.userImage.should.equals('profileImage/8/thumbnail.jpg');
        res.body.feed[0].user.userImagePreview.should.equals('profileImage/8/profilePreview.jpg');
        res.body.feed[0].user.isLoggedInUser.should.equals(false);
        res.body.feed[0].user.isTrustUser.should.equals(true);
        should.not.exist(res.body.feed[0].creator);
    });

    it('Getting only interesting question when topic correct', async function () {
        dbDsl.watchQuestion({questionId: '1', userId: '5', created: 399});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/feed/activity', {
            guiLanguage: 'de', languages: ['de'], topics: ['topic7']
        });
        res.status.should.equal(200);
        res.body.timestamp.should.least(startTime);
        res.body.feed.length.should.equals(0);
    });
});
