'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');

describe('Remove a admin from a commitment', function () {

    let startTime;

    beforeEach(async function () {
        await dbDsl.init(5);
        startTime = Math.floor(moment.utc().valueOf() / 1000);

        dbDsl.createRegion('international', {de: 'InternationalDe', en: 'InternationalEn'});
        dbDsl.createRegion('region-1', {parentRegionId: 'international', de: 'Region1De', en: 'Region1En'});

        dbDsl.createCommitment('1', {
            adminId: '1', topics: ['Spiritual', 'Meditation'], language: 'de', created: 700,
            website: 'https://www.example.org/', regions: ['region-1']
        });
        dbDsl.createCommitment('2', {
            adminId: '2', topics: ['Environmental', 'Economy'], language: 'de', created: 701,
            website: 'https://www.example2.org/', regions: ['region-1']
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Successfully remove another administrator of a commitment', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '4'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/admin', {
            commitmentId: '1', userId: '4'
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(:Commitment {commitmentId: '1'})<-[:IS_ADMIN]-(u:User)`)
            .return(`u.userId AS userId`).end().send();
        resp.length.should.equals(1);
        resp[0].userId.should.equals('1');
    });

    it('Successfully remove the logged-in user as administrator of a commitment', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '4'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/admin', {
            commitmentId: '1', userId: '1'
        });
        res.status.should.equal(200);

        let resp = await db.cypher()
            .match(`(:Commitment {commitmentId: '1'})<-[:IS_ADMIN]-(u:User)`)
            .return(`u.userId AS userId`).end().send();
        resp.length.should.equals(1);
        resp[0].userId.should.equals('4');
    });

    it('There must be at least one administrator', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/admin', {
            commitmentId: '1', userId: '1'
        });
        res.status.should.equal(400);

        let resp = await db.cypher()
            .match(`(:Commitment {commitmentId: '1'})<-[:IS_ADMIN]-(u:User)`)
            .return(`u.userId AS userId`).end().send();
        resp.length.should.equals(1);
        resp[0].userId.should.equals('1');
    });

    it('It is not allowed to remove other administrators if the user is not an administrator of the commitment', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '2', userId: '4'});

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/admin', {
            commitmentId: '2', userId: '4'
        });
        res.status.should.equal(400);

        let resp = await db.cypher()
            .match(`(:Commitment {commitmentId: '2'})<-[:IS_ADMIN]-(u:User)`)
            .return(`u.userId AS userId`).orderBy(`userId`).end().send();
        resp.length.should.equals(2);
        resp[0].userId.should.equals('2');
        resp[1].userId.should.equals('4');
    });

    it('Fail if the user to remove as administrator is not an administrator of the commitment', async function () {
        dbDsl.addAdminToCommitment({commitmentId: '1', userId: '4'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/commitment/admin', {
            commitmentId: '1', userId: '3'
        });
        res.status.should.equal(400);

        let resp = await db.cypher()
            .match(`(:Commitment {commitmentId: '1'})<-[:IS_ADMIN]-(u:User)`)
            .return(`u.userId AS userId`).orderBy(`userId`).end().send();
        resp.length.should.equals(2);
        resp[0].userId.should.equals('1');
        resp[1].userId.should.equals('4');
    });
});
