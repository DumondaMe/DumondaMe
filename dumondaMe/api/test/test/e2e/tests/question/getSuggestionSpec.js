'use strict';

let users = require('elyoos-server-test-util').user;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Getting suggestions from super users for a question', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(4);
        await requestHandler.logout();
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createMainTopic({topicId: 'topic2', descriptionDe: 'topic2De', descriptionEn: 'topic2En'});

        dbDsl.createQuestion('10', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'Test elyoos.org change the world',
            topics: ['topic1', 'topic2'], language: 'de', modified: 700
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('No suggestion exists', async function () {
        dbDsl.setUserIsSuperUser('1');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/suggestion', {questionId: '10', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreSuggestions.should.equals(false);
        res.body.suggestions.length.should.equals(0);
    });

    it('Get suggestions as super user', async function () {
        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '100', userId: '1', title: 'newTitle', description: 'newDescription',
            explanation: 'explanation', created: 999, open: true
        });

        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '101', userId: '3', title: 'newTitle2', description: 'newDescription2',
            explanation: 'explanation2', created: 998, open: true
        });
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/suggestion', {questionId: '10', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreSuggestions.should.equals(false);
        res.body.suggestions.length.should.equals(2);

        res.body.suggestions[0].suggestionId.should.equals('100');
        res.body.suggestions[0].title.should.equals('newTitle');
        res.body.suggestions[0].open.should.equals(true);
        res.body.suggestions[0].description.should.equals('newDescription');
        res.body.suggestions[0].explanation.should.equals('explanation');
        res.body.suggestions[0].created.should.equals(999);
        res.body.suggestions[0].creator.userId.should.equals('1');
        res.body.suggestions[0].creator.name.should.equals('user Meier');
        res.body.suggestions[0].creator.slug.should.equals('user-meier');
        res.body.suggestions[0].creator.userImage.should.equals('profileImage/1/thumbnail.jpg');
        res.body.suggestions[0].creator.userImagePreview.should.equals('profileImage/1/profilePreview.jpg');
        res.body.suggestions[0].creator.isLoggedInUser.should.equals(true);
        res.body.suggestions[0].creator.isTrustUser.should.equals(false);

        res.body.suggestions[1].suggestionId.should.equals('101');
        res.body.suggestions[1].title.should.equals('newTitle2');
        res.body.suggestions[1].open.should.equals(true);
        res.body.suggestions[1].description.should.equals('newDescription2');
        res.body.suggestions[1].explanation.should.equals('explanation2');
        res.body.suggestions[1].created.should.equals(998);
        res.body.suggestions[1].creator.userId.should.equals('3');
        res.body.suggestions[1].creator.name.should.equals('user Meier3');
        res.body.suggestions[1].creator.slug.should.equals('user-meier3');
        res.body.suggestions[1].creator.userImage.should.equals('profileImage/3/thumbnail.jpg');
        res.body.suggestions[1].creator.userImagePreview.should.equals('profileImage/3/profilePreview.jpg');
        res.body.suggestions[1].creator.isLoggedInUser.should.equals(false);
        res.body.suggestions[1].creator.isTrustUser.should.equals(true);
    });

    it('Open suggestion is showed first', async function () {
        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '100', userId: '1', title: 'newTitle', description: 'newDescription',
            explanation: 'explanation', created: 999, open: false
        });

        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '101', userId: '3', title: 'newTitle2', description: 'newDescription2',
            explanation: 'explanation2', created: 998, open: true
        });
        dbDsl.createContactConnection('1', '3');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/suggestion', {questionId: '10', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreSuggestions.should.equals(false);
        res.body.suggestions.length.should.equals(2);

        res.body.suggestions[0].suggestionId.should.equals('101');
        res.body.suggestions[0].open.should.equals(true);

        res.body.suggestions[1].suggestionId.should.equals('100');
        res.body.suggestions[1].open.should.equals(false);
    });

    it('Get suggestions as admin', async function () {
        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '100', userId: '4', title: 'newTitle', description: 'newDescription',
            explanation: 'explanation', created: 999, open: true
        });

        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '101', userId: '3', title: 'newTitle2', description: 'newDescription2',
            explanation: 'explanation2', created: 998, open: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser2);
        let res = await requestHandler.get('/api/question/suggestion', {questionId: '10', page: 0});
        res.status.should.equal(200);
        res.body.hasMoreSuggestions.should.equals(false);
        res.body.suggestions.length.should.equals(2);

        res.body.suggestions[0].suggestionId.should.equals('100');
        res.body.suggestions[1].suggestionId.should.equals('101');
    });

    it('Not allowed to get suggestions as normal user', async function () {
        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '100', userId: '4', title: 'newTitle', description: 'newDescription',
            explanation: 'explanation', created: 999, open: true
        });

        dbDsl.addSuggestionToQuestion({
            questionId: '10', suggestionId: '101', userId: '3', title: 'newTitle2', description: 'newDescription2',
            explanation: 'explanation2', created: 998, open: true
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/question/suggestion', {questionId: '10', page: 0});
        res.status.should.equal(400);
    });
});
