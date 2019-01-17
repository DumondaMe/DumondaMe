'use strict';

let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Unsubscribe email notification when new notifications', function () {

    beforeEach(async function () {
        await dbDsl.init(2);
        await dbDsl.sendToDb();
    });

    it('Unsubscribe to notifications', async function () {

        let res = await requestHandler.post('/api/unsubscribe/notifications', {email: 'user@irgendwo.ch'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {emailNormalized: 'user@irgendwo.ch'})")
            .where(`user.disableNewNotificationEmail = true`)
            .return('user').end().send();
        user.length.should.equals(1);
    });

    it('Unsubscribe to notifications (upper case)', async function () {

        let res = await requestHandler.post('/api/unsubscribe/notifications', {email: 'USER@irgendwo.ch'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {emailNormalized: 'user@irgendwo.ch'})")
            .where(`user.disableNewNotificationEmail = true`)
            .return('user').end().send();
        user.length.should.equals(1);
    });

    it('Not existing user does not alter database', async function () {

        let res = await requestHandler.post('/api/unsubscribe/notifications', {email: 'user3.irgendwas@dumonda.me'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User)")
            .return('user').end().send();
        user.length.should.equals(2);
    });
});
