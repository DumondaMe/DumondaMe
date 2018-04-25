'use strict';

let users = require('elyoos-server-test-util').user;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let requestHandler = require('elyoos-server-test-util').requestHandler;
let moment = require('moment');

describe('Handling contact relationships', function () {

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

    it('Adding a contact and send adding notification to contact (Added contact has no notifications)', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/5');
        res.status.should.equal(200);
        res.body.isContactSince.should.least(startTime);
        let user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '5'})")
            .return('r.contactAdded as contactAdded')
            .end().send();
        user.length.should.equals(1);
        user[0].contactAdded.should.equals(res.body.isContactSince);

        let notification = await db.cypher().match(`(:User {userId: '5'})<-[:NOTIFIED]-
        (notification:Notification {type: 'addedToTrustCircle'})-[relNot:NOTIFICATION]->(user)`)
            .return('notification, user.userId AS userId, relNot.created AS created')
            .end().send();
        notification.length.should.equals(1);
        notification[0].notification.created.should.least(startTime);
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
    });

    it('Adding a contact and send adding notification to contact (Added contact has notifications)', async function () {
        dbDsl.notificationUserAddedToTrustCircle({
            userId: '5',
            created: 678, trustCircleUsers: [{userId: '3', created: 555}, {userId: '4', created: 444}]
        });

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/5');
        res.status.should.equal(200);
        res.body.isContactSince.should.least(startTime);
        let user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '5'})")
            .return('r.contactAdded as contactAdded')
            .end().send();
        user.length.should.equals(1);
        user[0].contactAdded.should.equals(res.body.isContactSince);

        let notification = await db.cypher().match(`(:User {userId: '5'})<-[:NOTIFIED]-
        (notification:Notification {type: 'addedToTrustCircle'})-[relNot:NOTIFICATION]->(user)`)
            .return('notification, user.userId AS userId, relNot.created AS created')
            .orderBy(`created DESC`)
            .end().send();
        notification.length.should.equals(3);
        notification[0].notification.created.should.least(startTime);
        notification[0].userId.should.equals('1');
        notification[0].created.should.least(startTime);
        notification[1].userId.should.equals('3');
        notification[1].created.should.equals(555);
        notification[2].userId.should.equals('4');
        notification[2].created.should.equals(444);
    });

    it('Adding a contact and remove invitations', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/6');
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

    it('Deny adding to contact when privacy set to onlyContact and no contact relationship exits', async function () {

        dbDsl.setUserPrivacy('4', {privacyMode: 'onlyContact'});
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/4');
        res.status.should.equal(401);
        let user = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '4'})")
            .return('r').end().send();
        user.length.should.equals(0);
    });

    it('Add the same User two times as contact should result in one contact connection', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/2');
        res.status.should.equal(200);

        res = await requestHandler.post('/api/user/contact/2');
        res.status.should.equal(200);
        let user = await db.cypher().match(`(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})`)
            .return('r').end().send();
        user.length.should.equals(1);
    });

    it('If user is blocked, add contact removes blocked state', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/block/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);

        res = await requestHandler.post('/api/user/contact/2');
        res.status.should.equal(200);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);
    });

    it('Contact is blocked after it is added to the contacts', async function () {

        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);

        res = await requestHandler.post('/api/user/contact/block/2');
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
        let res = await requestHandler.post('/api/user/contact/block/6');
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User {userId: '1'})<-[:HAS_INVITED]-(:User {userId: '6'})")
            .return('user').end().send();
        user.length.should.equals(0);
    });

    it('Contact are unblocked', async function () {

        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.post('/api/user/contact/block/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(1);

        res = await requestHandler.del('/api/user/contact/block/2');
        res.status.should.equal(200);

        rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_BLOCKED]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);
    });

    it('Remove user from contact list', async function () {

        dbDsl.createContactConnection('1', '2');
        await dbDsl.sendToDb();
        await requestHandler.login(users.validUser);
        let res = await requestHandler.del('/api/user/contact/2');
        res.status.should.equal(200);

        let rel = await db.cypher().match("(:User {userId: '1'})-[r:IS_CONTACT]->(:User {userId: '2'})")
            .return('r').end().send();
        rel.length.should.equals(0);
    });
});
