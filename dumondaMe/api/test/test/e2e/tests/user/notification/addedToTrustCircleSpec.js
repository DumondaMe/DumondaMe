'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Notification when user has been added to trust circle', function () {

    beforeEach(async function () {
        await dbDsl.init(6);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get notification when user has been added to trust circle', async function () {
        dbDsl.createContactConnection('3', '1', null, 400);
        dbDsl.createContactConnection('4', '1', null, 401);
        dbDsl.createContactConnection('5', '1', null, 401);
        dbDsl.createContactConnection('6', '1', null, 401);
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '1', created: 678, trustCircleUsers:
                [{userId: '3', created: 400}, {userId: '4', created: 401}, {userId: '5', created: 402},
                    {userId: '6', created: 399}]
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
        res.body.notifications[0].type.should.equals('addedToTrustCircle');
        res.body.notifications[0].numberOfUsers.should.equals(4);
        res.body.notifications[0].users.length.should.equals(3);
        res.body.notifications[0].users[0].userId.should.equals('5');
        res.body.notifications[0].users[0].added.should.equals(402);
        res.body.notifications[0].users[0].name.should.equals('user Meier5');
        res.body.notifications[0].users[0].slug.should.equals('user-meier5');
        res.body.notifications[0].users[0].thumbnailUrl.should.equals('profileImage/5/thumbnail.jpg');
        res.body.notifications[0].users[0].isAnonymous.should.equals(false);
        res.body.notifications[0].users[1].userId.should.equals('4');
        res.body.notifications[0].users[1].added.should.equals(401);
        res.body.notifications[0].users[1].name.should.equals('user Meier4');
        res.body.notifications[0].users[1].slug.should.equals('user-meier4');
        res.body.notifications[0].users[1].thumbnailUrl.should.equals('profileImage/4/thumbnail.jpg');
        res.body.notifications[0].users[1].isAnonymous.should.equals(false);
        res.body.notifications[0].users[2].userId.should.equals('3');
        res.body.notifications[0].users[2].added.should.equals(400);
        res.body.notifications[0].users[2].name.should.equals('user Meier3');
        res.body.notifications[0].users[2].slug.should.equals('user-meier3');
        res.body.notifications[0].users[2].thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
        res.body.notifications[0].users[2].isAnonymous.should.equals(false);
    });
});
