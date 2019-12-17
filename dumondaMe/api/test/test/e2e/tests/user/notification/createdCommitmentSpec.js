'use strict';

const users = require('dumonda-me-server-test-util').user;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const should = require('chai').should();

describe('Notifications when user created a commitment', function () {

    beforeEach(async function () {
        await dbDsl.init(6);

        dbDsl.createMainTopic({topicId: 'topic1', descriptionDe: 'topic1De', descriptionEn: 'topic1En'});
        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['topic1'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein engagement',
            description: "Das ist die Beschreibung"
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Get notification when a commitment has been created', async function () {
        dbDsl.notificationUserCreatedCommitment({commitmentId: '1', created: 678, notifiedUserId: '1'});
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
        res.body.notifications[0].type.should.equals('newCommitment');
        res.body.notifications[0].commitmentId.should.equals('1');
        res.body.notifications[0].commitmentTitle.should.equals('Das ist ein engagement');
        res.body.notifications[0].commitmentDescription.should.equals('Das ist die Beschreibung');
        res.body.notifications[0].commitmentSlug.should.equals('das-ist-ein-engagement');
        res.body.notifications[0].commitmentImage.should.equals(`${process.env.PUBLIC_IMAGE_BASE_URL}/commitment/1/120x120/title.jpg`);
        res.body.notifications[0].numberOfUsers.should.equals(1);
        res.body.notifications[0].users.length.should.equals(1);
        res.body.notifications[0].users[0].userId.should.equals('2');
        res.body.notifications[0].users[0].name.should.equals('user Meier2');
        res.body.notifications[0].users[0].slug.should.equals('user-meier2');
        res.body.notifications[0].users[0].thumbnailUrl.should.equals('profileImage/2/thumbnail.jpg');
        res.body.notifications[0].users[0].isAnonymous.should.equals(false);
    });

    it('Get notification when user created a commitment', async function () {
        dbDsl.createCommitment('2', {
            adminId: '1', topics: ['topic1'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1'], title: 'Das ist ein engagement',
            description: "Das ist die Beschreibung"
        });
        dbDsl.notificationCreatedCommitmentCreator({commitmentId: '2', created: 679});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.get('/api/user/notification', {skip: 0, limit: 10});
        res.status.should.equal(200);
        res.body.numberOfUnreadNotifications.should.equals(1);
        res.body.hasMoreNotifications.should.equals(false);
        res.body.notifications.length.should.equals(1);
        should.exist(res.body.notifications[0].notificationId);
        res.body.notifications[0].read.should.equals(false);
        res.body.notifications[0].created.should.equals(679);
        res.body.notifications[0].type.should.equals('newCommitmentCreator');
        res.body.notifications[0].commitmentId.should.equals('2');
        res.body.notifications[0].commitmentTitle.should.equals('Das ist ein engagement');
        res.body.notifications[0].commitmentSlug.should.equals('das-ist-ein-engagement');
    });
});
