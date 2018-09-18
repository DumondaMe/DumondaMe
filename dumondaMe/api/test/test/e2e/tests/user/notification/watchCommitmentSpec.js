'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Notification when commitment of user has new watches', function () {

    beforeEach(async function () {
        await dbDsl.init(5);

        dbDsl.createRegion('region-1', {de: 'regionDe', en: 'regionEn'});

        dbDsl.createCommitment('50', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700, title: 'Das ist ein Engagement',
            website: 'https://www.example.org/', regions: ['region']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get notification when users watching commitment', async function () {

        dbDsl.userWatchesCommitment('20', {
            commitmentId: '50',
            created: 678, watchingUsers: [{userId: '3', created: 444}, {userId: '4', created: 555}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification');
        res.status.should.equal(200);
        res.body.numberOfNotifications.should.equals(1);
        res.body.notifications.length.should.equals(1);
        res.body.notifications[0].notificationId.should.equals('20');
        res.body.notifications[0].created.should.equals(678);
        res.body.notifications[0].type.should.equals('watchingCommitment');
        res.body.notifications[0].commitmentId.should.equals('50');
        res.body.notifications[0].commitmentTitle.should.equals('Das ist ein Engagement');
        res.body.notifications[0].commitmentSlug.should.equals('das-ist-ein-engagement');
        res.body.notifications[0].numberOfUsers.should.equals(2);
        res.body.notifications[0].users.length.should.equals(2);
        res.body.notifications[0].users[0].userId.should.equals('4');
        res.body.notifications[0].users[0].added.should.equals(555);
        res.body.notifications[0].users[0].name.should.equals('user Meier4');
        res.body.notifications[0].users[0].slug.should.equals('user-meier4');
        res.body.notifications[0].users[0].thumbnailUrl.should.equals('profileImage/4/thumbnail.jpg');
        res.body.notifications[0].users[1].userId.should.equals('3');
        res.body.notifications[0].users[1].added.should.equals(444);
        res.body.notifications[0].users[1].name.should.equals('user Meier3');
        res.body.notifications[0].users[1].slug.should.equals('user-meier3');
        res.body.notifications[0].users[1].thumbnailUrl.should.equals('profileImage/3/thumbnail.jpg');
    });
});
