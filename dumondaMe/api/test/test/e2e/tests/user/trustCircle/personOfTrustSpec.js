'use strict';

const users = require('dumonda-me-server-test-util').user;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const moment = require('moment');
const should = require('chai').should();

describe('Handling person of trust relationship', function () {

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

    it('Adding a person of trust and send adding notification to person (Added person of trust has previously no notifications)', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        let user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '5'})")
            .return('r.contactAdded as contactAdded')
            .end().send();
        user.length.should.equals(1);
        user[0].contactAdded.should.equals(res.body.personOfTrustSince);

        let notification = await db.cypher().match(`(:User {userId: '5'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'addedToTrustCircle'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .return('notification, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        should.exist(notification[0].notification.notificationId);
        notification[0].notification.created.should.least(startTime);
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Adding a person of trust and send adding notification to person (Added person has notifications)', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '5',
            created: 678, trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        let user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '5'})")
            .return('r.contactAdded as contactAdded')
            .end().send();
        user.length.should.equals(1);
        user[0].contactAdded.should.equals(res.body.personOfTrustSince);

        let notification = await db.cypher().match(`(:User {userId: '5'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'addedToTrustCircle'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .return('notification, user.userId AS userId, relNot.created AS created')
            .orderBy(`created DESC`)
            .end().send();
        notification.length.should.equals(3);
        notification[0].notification.notificationId.should.equals('50');
        notification[0].notification.created.should.least(startTime);
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
        notification[1].userId.should.equals('3');
        notification[1].created.should.equals(555);
        notification[2].userId.should.equals('4');
        notification[2].created.should.equals(444);
    });

    it('Adding a person of trust and send adding notification to person (Added person has read notifications)', async function () {
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '5', read: true,
            created: 678, trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/5');
        res.status.should.equal(200);
        res.body.personOfTrustSince.should.least(startTime);
        let user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '5'})")
            .return('r.contactAdded as contactAdded')
            .end().send();
        user.length.should.equals(1);
        user[0].contactAdded.should.equals(res.body.personOfTrustSince);

        let notification = await db.cypher().match(`(:User {userId: '5'})<-[:NOTIFIED]-
        (notification:Notification:Unread {type: 'addedToTrustCircle'})-[relNot:ORIGINATOR_OF_NOTIFICATION]->(user)`)
            .return('notification, user.userId AS userId, relNot.created AS created')
            .orderBy(`created DESC`)
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.notificationId.should.not.equals('50');
        notification[0].notification.created.should.least(startTime);
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Adding a person of trust and remove invitations', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/6');
        res.status.should.equal(200);
        let user = await db.cypher().match("(u:User {userId: '1'})<-[:HAS_INVITED]-(:User {userId: '6'})")
            .return('u').end().send();
        user.length.should.equals(0);
        user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '6'})")
            .return('r.contactAdded as contactAdded')
            .end().send();
        user.length.should.equals(1);
        user[0].contactAdded.should.least(startTime);
    });

    it('Deny adding to trust circle when privacy set to onlyContact and no person of trust relationship exits', async function () {

        dbDsl.setUserPrivacy('4', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/4');
        res.status.should.equal(400);
        let user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '4'})")
            .return('r').end().send();
        user.length.should.equals(0);
    });

    it('Deny adding user to his own trust circle', async function () {
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/1');
        res.status.should.equal(400);
    });

    it('Add the same User two times to trust circle should result in one person of trust connection', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/2');
        res.status.should.equal(200);

        res = await requestHandler.post('/api/user/trustCircle/2');
        res.status.should.equal(200);
        let user = await db.cypher().match(`(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})`)
            .return('r').end().send();
        user.length.should.equals(1);
    });

    it('If user is blocked, adding person of trust removes blocked state', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/otherUser/block/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);

        res = await requestHandler.post('/api/user/trustCircle/2');
        res.status.should.equal(200);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);
    });

    it('Person of trust is blocked after it is added to the trust circle', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/trustCircle/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);

        res = await requestHandler.post('/api/user/otherUser/block/2');
        res.status.should.equal(200);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);
    });

    it('Blocking of user removes invitation', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/otherUser/block/6');
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User {userId: '1'})<-[:HAS_INVITED]-(:User {userId: '6'})")
            .return('user').end().send();
        user.length.should.equals(0);
    });

    it('Person of trust is unblocked', async function () {

        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/otherUser/block/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);

        res = await requestHandler.del('/api/user/otherUser/block/2');
        res.status.should.equal(200);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);
    });

    it('Remove user from trust circle', async function () {

        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/trustCircle/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);
    });

    it('Remove user from trust circle (Delete user from notification)', async function () {

        dbDsl.createContactConnection('1', '2');
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2',
            created: 678, trustCircleUsers: [{userId: '1', created: 555}, {userId: '4', created: 444}]
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/trustCircle/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);

        rel = await db.cypher().match("(:User {userId: '2'})<-[:NOTIFIED]-(n:Notification)-[:ORIGINATOR_OF_NOTIFICATION]->(u:User)")
            .return('n, u').end().send();
        rel.length.should.equals(1);
        rel[0].u.userId.should.equals('4');
    });

    it('Remove user from trust circle (Delete user from notification and delete notification)', async function () {

        dbDsl.createContactConnection('1', '2');
        dbDsl.notificationUserAddedToTrustCircle('50', {
            userId: '2',
            created: 678, trustCircleUsers: [{userId: '1', created: 555}]
        });
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/trustCircle/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);

        rel = await db.cypher().match("(:User {userId: '2'})<-[:NOTIFIED]-(n:Notification)")
            .return('n').end().send();
        rel.length.should.equals(0);
    });
});
