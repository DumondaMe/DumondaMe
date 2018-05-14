'use strict';

const users = require('elyoos-server-test-util').user;
const dbDsl = require('elyoos-server-test-util').dbDSL;
const requestHandler = require('elyoos-server-test-util').requestHandler;
const sinon = require('sinon');
const should = require('chai').should();

describe('Get number of notifications for a user', function () {

    let sandbox;

    beforeEach(async function () {
        await dbDsl.init(5);
        sandbox = sinon.sandbox.create();

        dbDsl.createRegion('region-1', {});
    });

    afterEach(function () {
        sandbox.restore();
        return requestHandler.logout();
    });

    it('Get number of notification', async function () {

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

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification/status');
        res.status.should.equal(200);
        res.body.numberOfNotifications.should.equals(1);
        should.not.exist(res.body.notifications);
    });
});
