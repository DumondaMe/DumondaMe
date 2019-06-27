'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Notification when user has been asked to be administrator of a commitment', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine Frage', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, modified: 701,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein Test'
        });
        dbDsl.createCommitmentAnswer('100', {
            creatorId: '2', questionId: '1', commitmentId: '10', created: 500, description: 'test'
        });

        dbDsl.notificationRequestAdminOfCommitment('50',
            {commitmentId: '1', existingAdminId: '2', newAdminId: '1', created: 666});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get notification when asked to be administrator of commitment.', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.numberOfUnreadNotifications.should.equals(1);
        res.body.hasMoreNotifications.should.equals(false);
        res.body.notifications.length.should.equals(1);
        res.body.notifications[0].notificationId.should.equals('50');
        res.body.notifications[0].read.should.equals(false);
        res.body.notifications[0].confirmToBeAdmin.should.equals(false);
        res.body.notifications[0].created.should.equals(666);
        res.body.notifications[0].type.should.equals('requestAdminOfCommitment');
        res.body.notifications[0].userId.should.equals('2');
        res.body.notifications[0].userName.should.equals('user Meier2');
        res.body.notifications[0].userSlug.should.equals('user-meier2');
        res.body.notifications[0].commitmentId.should.equals('1');
        res.body.notifications[0].commitmentTitle.should.equals('Das ist ein Test');
        res.body.notifications[0].commitmentSlug.should.equals('das-ist-ein-test');
    });
});
