'use strict';

let requestHandler = require('dumonda-me-server-test-util').requestHandler;
let users = require('dumonda-me-server-test-util').user;
let db = require('dumonda-me-server-test-util').db;
let dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Setting of the email notifications', function () {

    beforeEach(async function () {
        await dbDsl.init(1);
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Disable email notification', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications', {interval: 'never'});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user').end().send();
        user.length.should.equals(0);
    });

    it('Enable Email Notification to interval of one hour', async function () {
        dbDsl.disableEMailNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications', {interval: 'hour'});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user').end().send();
        user.length.should.equals(1);
        user[0].user.emailNotificationInterval.should.equals(3600);
    });

    it('Email Notification to interval of one day', async function () {
        dbDsl.disableEMailNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications', {interval: 'day'});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user').end().send();
        user.length.should.equals(1);
        user[0].user.emailNotificationInterval.should.equals(86400);
    });

    it('Email Notification to interval of three days', async function () {
        dbDsl.disableEMailNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications', {interval: '3days'});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user').end().send();
        user.length.should.equals(1);
        user[0].user.emailNotificationInterval.should.equals(259200);
    });

    it('Email Notification to interval of one week', async function () {
        dbDsl.disableEMailNotification('1');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/settings/emailNotifications', {interval: 'week'});
        res.status.should.equal(200);

        let user = await db.cypher().match(`(user:User:EMailNotificationEnabled {userId: '1'})`)
            .return('user').end().send();
        user.length.should.equals(1);
        user[0].user.emailNotificationInterval.should.equals(604800);
    });
});
