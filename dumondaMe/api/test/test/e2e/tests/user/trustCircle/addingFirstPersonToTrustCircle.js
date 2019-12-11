'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Adding first person to trust circle', function () {

    let startTime;

    beforeEach(async function () {

        startTime = Math.floor(moment.utc().valueOf() / 1000);
        await dbDsl.init(6);
        dbDsl.createContactConnection('5', '1', null, startTime);
        dbDsl.inviteUser('6', '1');
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Adding first person to trust circle generates one time notification', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(true);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstTrustCircleUser'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
    });

    it('Adding second person to trust circle generates no one time notification', async function () {
        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstTrustCircleUser'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(0);
    });

    it('Adding first person to trust circle with existing notification generates no one time notification', async function () {
        dbDsl.notificationOneTimeFirstTrustCircleUser('10', {userId: '1', created: 500});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        res.body.oneTimeNotificationCreated.should.equals(false);

        let notification = await db.cypher().match(`(:User {userId: '1'})<-[:NOTIFIED]-
        (notification:Notification:Unread:NoEmail:OneTime {type: 'oneTimeFirstTrustCircleUser'})`)
            .return('notification')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.equals('10');
        notification[0].notification.created.should.equals(500);
    });
});
