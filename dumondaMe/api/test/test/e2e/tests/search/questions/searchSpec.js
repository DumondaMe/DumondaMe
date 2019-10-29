'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Search for question with fuzzy match', function () {

    beforeEach(async function () {
        await dbDsl.init(4);
        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage', created: 500, modified: 700,
            description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
        });
        dbDsl.createBookAnswer('6', {
            creatorId: '2', questionId: '10', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createBookAnswer('7', {
            creatorId: '2', questionId: '10', created: 601, authors: 'Radisli', googleBookId: '1234',
            hasPreviewImage: true
        });
        dbDsl.createQuestion('12', {
            creatorId: '2', question: 'Dass ist ene Frae', description: 'Test dumonda.me change the world2',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        dbDsl.watchQuestion({userId: '4', questionId: '10', created: 997});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Search question when not logged in', async function () {
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        let res = await requestHandler.get('/api/search/questions', {query: 'Das ist eine Frage', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreQuestions.should.equals(false);
        res.body.questions.length.should.equals(2);
        res.body.questions[0].questionId.should.equals('10');
        res.body.questions[0].question.should.equals('Das ist eine Frage');
        res.body.questions[0].slug.should.equals('das-ist-eine-frage');
        res.body.questions[0].description.should.equals('Test dumonda.me change the world1');
        res.body.questions[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.questions[0].numberOfAnswers.should.equals(2);
        res.body.questions[0].numberOfWatches.should.equals(1);
        res.body.questions[0].isWatchedByUser.should.equals(false);
        res.body.questions[0].isAdmin.should.equals(false);
        res.body.questions[0].user.userId.should.equals('2');
        res.body.questions[0].user.name.should.equals('user Meier2');
        res.body.questions[0].user.slug.should.equals('user-meier2');
        res.body.questions[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.questions[0].user.isLoggedInUser.should.equals(false);
        res.body.questions[0].user.isTrustUser.should.equals(false);
        res.body.questions[0].user.isAnonymous.should.equals(false);
        res.body.questions[1].questionId.should.equals('12');
    });

    it('Search question when logged in', async function () {
        dbDsl.watchQuestion({questionId: '10', userId: '1', created: 558});
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/questions', {query: 'Das ist eine Frage', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreQuestions.should.equals(false);
        res.body.questions.length.should.equals(2);
        res.body.questions[0].questionId.should.equals('10');
        res.body.questions[0].question.should.equals('Das ist eine Frage');
        res.body.questions[0].slug.should.equals('das-ist-eine-frage');
        res.body.questions[0].description.should.equals('Test dumonda.me change the world1');
        res.body.questions[0].descriptionHtml.should.equals(`Test <a href="http://dumonda.me" class="linkified" target="_blank" rel="noopener">dumonda.me</a> change the world1`);
        res.body.questions[0].numberOfAnswers.should.equals(2);
        res.body.questions[0].numberOfWatches.should.equals(2);
        res.body.questions[0].isWatchedByUser.should.equals(true);
        res.body.questions[0].isAdmin.should.equals(false);
        res.body.questions[0].user.userId.should.equals('2');
        res.body.questions[0].user.name.should.equals('user Meier2');
        res.body.questions[0].user.slug.should.equals('user-meier2');
        res.body.questions[0].user.userImage.should.equals('profileImage/2/thumbnail.jpg');
        res.body.questions[0].user.userImagePreview.should.equals('profileImage/2/profilePreview.jpg');
        res.body.questions[0].user.isLoggedInUser.should.equals(false);
        res.body.questions[0].user.isTrustUser.should.equals(false);
        res.body.questions[0].user.isAnonymous.should.equals(false);
        res.body.questions[1].questionId.should.equals('12');
    });

    it('Search question created by the logged in user', async function () {
        dbDsl.createQuestion('13', {
            creatorId: '1', question: 'BlaBlaBla', description: 'Test dumonda.me change the world2',
            topics: ['topic1'], language: 'de', created: 500, modified: 700
        });
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/questions', {query: 'BlaBlaBla', lang: 'de', skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.hasMoreQuestions.should.equals(false);
        res.body.questions.length.should.equals(1);
        res.body.questions[0].questionId.should.equals('13');
        res.body.questions[0].isWatchedByUser.should.equals(false);
        res.body.questions[0].isAdmin.should.equals(true);
    });

    it('Has more questions', async function () {
        for (let index = 0; index < 7; index++) {
            dbDsl.createQuestion(`10${index}`, {
                creatorId: '2', question: 'Das ist eine Frage', created: 500, modified: 700,
                description: 'Test dumonda.me change the world1', topics: ['topic1'], language: 'de'
            });
        }
        await dbDsl.sendToDb();
        await dbDsl.setApocIndex();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/search/questions', {query: 'Das ist eine Frage', lang: 'de', skip: 1, limit: 4});
        res.status.should.equal(200);
        res.body.hasMoreQuestions.should.equals(true);
        res.body.questions.length.should.equals(4);
    });
});
