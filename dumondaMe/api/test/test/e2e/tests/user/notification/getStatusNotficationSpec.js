'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();

describe('Get number of unread notifications for a user', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get number of unread notification', async function () {

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createCommitment('2', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Test'
        });
        dbDsl.createCommitment('3', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Test'
        });
        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '1', commitmentId: '2', created: 500, description: 'test'
        });
        dbDsl.createCommitmentAnswer('101', {
            creatorId: '2', questionId: '1', commitmentId: '3', created: 500, description: 'test'
        });

        dbDsl.notificationShowQuestionOnCommitmentRequest('50', {
            questionId: '1', commitmentId: '2', adminId: '1', created: 666
        });

        dbDsl.notificationShowQuestionOnCommitmentRequest('51', {
            questionId: '1', commitmentId: '3', adminId: '1', created: 777, read: true
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification/status');
        res.status.should.equal(200);
        res.body.numberOfUnreadNotifications.should.equals(1);
        should.not.exist(res.body.notifications);
    });
});
