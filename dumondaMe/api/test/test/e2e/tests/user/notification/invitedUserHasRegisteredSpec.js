'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Notification when invited user has been registered', function () {

    beforeEach(async function () {
        await dbDsl.init(6);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get notification when invited user has been registered', async function () {
        dbDsl.notificationInvitedUserHasRegistered('50', {
            userId: '1', created: 678, invitedUserId: '2'
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.numberOfUnreadNotifications.should.equals(1);
        res.body.hasMoreNotifications.should.equals(false);
        res.body.notifications.length.should.equals(1);
        res.body.notifications[0].notificationId.should.equals('50');
        res.body.notifications[0].read.should.equals(false);
        res.body.notifications[0].created.should.equals(678);
        res.body.notifications[0].type.should.equals('invitedUserHasRegistered');
        res.body.notifications[0].users.length.should.equals(1);
        res.body.notifications[0].users[0].userId.should.equals('2');
        res.body.notifications[0].users[0].name.should.equals('user Meier2');
        res.body.notifications[0].users[0].slug.should.equals('user-meier2');
        res.body.notifications[0].users[0].thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.notifications[0].users[0].isAnonymous.should.equals(false);
    });
});
