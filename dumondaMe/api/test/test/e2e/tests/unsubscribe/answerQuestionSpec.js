'use strict';

let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;
let requestHandler = require('dumonda-me-server-test-util').requestHandler;

describe('Unsubscribe email notification to answer a question', function () {

    beforeEach(async function () {
        await dbDsl.init(2);
        await dbDsl.sendToDb();
    });

    it('Unsubscribe to answer question', async function () {

        let res = await requestHandler.post('/api/unsubscribe/answerQuestion', {email: 'user@irgendwo.ch'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {emailNormalized: 'user@irgendwo.ch'})")
            .where(`user.disableInviteAnswerQuestionNotification = true`)
            .return('user').end().send();
        user.length.should.equals(1);
    });

    it('Unsubscribe to answer question (upper case)', async function () {

        let res = await requestHandler.post('/api/unsubscribe/answerQuestion', {email: 'USER@irgendwo.ch'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User:EMailNotificationEnabled {emailNormalized: 'user@irgendwo.ch'})")
            .where(`user.disableInviteAnswerQuestionNotification = true`)
            .return('user').end().send();
        user.length.should.equals(1);
    });

    it('Not existing user does not alter database', async function () {

        let res = await requestHandler.post('/api/unsubscribe/answerQuestion', {email: 'user3.irgendwas@dumonda.me'});
        res.status.should.equal(200);

        let user = await db.cypher().match("(user:User)")
            .return('user').end().send();
        user.length.should.equals(2);
    });
});
