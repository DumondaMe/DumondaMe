'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;

describe('Notification when commitment has been added as answer to a question', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createCommitment('2', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Test'
        });
        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '1', commitmentId: '10', created: 500, description: 'test'
        });

        dbDsl.notificationShowQuestionOnCommitmentRequest('50', {questionId: '1', commitmentId: '2', adminId: '1',
            created: 666});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get notification when admin of commitment and commitment has been added to question', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification');
        res.status.should.equal(200);
        res.body.numberOfNotifications.should.equals(1);
        res.body.notifications.length.should.equals(1);
        res.body.notifications[0].notificationId.should.equals('50');
        res.body.notifications[0].created.should.equals(666);
        res.body.notifications[0].type.should.equals('showQuestionRequest');
        res.body.notifications[0].commitmentId.should.equals('2');
        res.body.notifications[0].commitmentTitle.should.equals('Das ist ein Test');
        res.body.notifications[0].commitmentSlug.should.equals('das-ist-ein-test');
        res.body.notifications[0].questionId.should.equals('1');
        res.body.notifications[0].question.should.equals('Das ist eine Frage');
        res.body.notifications[0].questionSlug.should.equals('das-ist-eine-frage');
    });
});
