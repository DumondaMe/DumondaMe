'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();

describe('Notification when user of trust circle has created a question', function () {

    beforeEach(async function () {
        await dbDsl.init(6);

        dbDsl.createQuestion('1', {
            creatorId: '2', question: 'Das ist eine FragöÖÄäÜü', description: 'description', topics: ['Spiritual'],
            language: 'de'
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get notification when user of trust circle has created a question', async function () {
        dbDsl.createContactConnection('1', '2');
        dbDsl.notificationUserCreatedQuestion({questionId: '1', created: 678});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.numberOfUnreadNotifications.should.equals(1);
        res.body.hasMoreNotifications.should.equals(false);
        res.body.notifications.length.should.equals(1);
        should.exist(res.body.notifications[0].notificationId);
        res.body.notifications[0].read.should.equals(false);
        res.body.notifications[0].created.should.equals(678);
        res.body.notifications[0].type.should.equals('newQuestion');
        res.body.notifications[0].questionId.should.equals('1');
        res.body.notifications[0].questionTitle.should.equals('Das ist eine FragöÖÄäÜü');
        res.body.notifications[0].questionSlug.should.equals('das-ist-eine-fragoeoeaeaeueue');
        res.body.notifications[0].numberOfUsers.should.equals(1);
        res.body.notifications[0].users.length.should.equals(1);
        res.body.notifications[0].users[0].userId.should.equals('2');
        res.body.notifications[0].users[0].name.should.equals('user Meier2');
        res.body.notifications[0].users[0].slug.should.equals('user-meier2');
        res.body.notifications[0].users[0].thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.notifications[0].users[0].isAnonymous.should.equals(false);
    });
});
