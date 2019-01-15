'use strict';

let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let users = require('dumonda-me-server-test-util').user;
let should = require('chai').should();
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Setting of the email notifications', function () {

    beforeEach(async function () {
        await dbDsl.init(1);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Enable Email Notification', async function () {
        dbDsl.disableEMailNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications',
            {enableEmailNotifications: true, enableInviteToAnswerQuestion: true});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user').end().send();
        user.length.should.equals(1);
    });

    it('Disable email notification', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications',
            {enableEmailNotifications: false, enableInviteToAnswerQuestion: true});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user').end().send();
        user.length.should.equals(0);
    });

    it('Enable email invitations to answer a question', async function () {
        dbDsl.disableInviteAnswerQuestionNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications',
            {enableEmailNotifications: true, enableInviteToAnswerQuestion: true});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user.disableInviteAnswerQuestionNotification AS disableInviteAnswerQuestionNotification')
            .end().send();
        user.length.should.equals(1);
        should.not.exist(user[0].disableInviteAnswerQuestionNotification)
    });

    it('Disable email invitations to answer a question', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications',
            {enableEmailNotifications: true, enableInviteToAnswerQuestion: false});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user.disableInviteAnswerQuestionNotification AS disableInviteAnswerQuestionNotification')
            .end().send();
        user.length.should.equals(1);
        user[0].disableInviteAnswerQuestionNotification.should.equals(true);
    });
});
