'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Handling confirmations for adding admin to commitment', function () {

    beforeEach(async function () {
        await dbDsl.init(3);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            adminId: '2', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });

        dbDsl.notificationRequestAdminOfCommitment('10',
            {commitmentId: '1', existingAdminId: '2', newAdminId: '1', created: 500});
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Confirm to be admin of commitment', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/admin/confirmAdmin',
            {notificationId: '10', confirmToBeAdmin: true});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(n:Notification)").where(`NOT n:Unread`)
            .return(`n`).end().send();
        resp.length.should.equals(1);
        resp[0].n.notificationId.should.equals('10');
        resp[0].n.confirmToBeAdmin.should.equals(true);

        resp = await db.cypher().match("(c:Commitment {commitmentId: '1'})<-[:IS_ADMIN]-(:User {userId: '1'})")
            .return(`c`).end().send();
        resp.length.should.equals(1);
    });

    it('Deny to be admin of commitment', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/admin/confirmAdmin',
            {notificationId: '10', confirmToBeAdmin: false});
        res.status.should.equal(200);

        let resp = await db.cypher().match("(n:Notification)").where(`NOT n:Unread`)
            .return(`n`).end().send();
        resp.length.should.equals(1);
        resp[0].n.notificationId.should.equals('10');
        resp[0].n.confirmToBeAdmin.should.equals(false);

        resp = await db.cypher().match("(c:Commitment {commitmentId: '1'})<-[:IS_ADMIN]-(:User {userId: '1'})")
            .return(`q`).end().send();
        resp.length.should.equals(0);
    });

    it('Fail if user uses wrong notification id', async function () {
        dbDsl.notificationRequestAdminOfCommitment('11',
            {commitmentId: '1', existingAdminId: '2', newAdminId: '3', created: 500});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/commitment/admin/confirmAdmin',
            {notificationId: '11', confirmToBeAdmin: true});
        res.status.should.equal(400);

        let resp = await db.cypher().match("(n:Notification:Unread {notificationId: '11'})")
            .return(`n`).end().send();
        resp.length.should.equals(1);

        resp = await db.cypher().match("(c:Commitment {commitmentId: '1'})<-[:IS_ADMIN]-(:User {userId: '1'})")
            .return(`c`).end().send();
        resp.length.should.equals(0);
    });
});
