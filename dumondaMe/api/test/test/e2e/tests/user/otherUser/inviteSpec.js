'use strict';

const users = require('dumonda-me-server-test-util').user;
const requestHandler = require('dumonda-me-server-test-util').requestHandler;
const db = require('dumonda-me-server-test-util').db;
const dbDsl = require('dumonda-me-server-test-util').dbDSL;

describe('Integration Tests for inviting other users to dumondaMe', function () {

    beforeEach(async function () {
        await dbDsl.init(6);

    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Invite not registered person', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/otherUser/invite', {
            emails: ['TEST@irgendwo.ch']
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(invitedUser:InvitedUser)<-[:HAS_INVITED]-(user:User {userId: '1'})`)
            .where(`(invitedUser)<-[:SENDING_EMAIL_PENDING]-(user)`)
            .return("invitedUser.email AS email, invitedUser.emailNormalized AS emailNormalized")
            .orderBy("invitedUser.email DESC").end().send();
        resp.length.should.equals(1);
        resp[0].email.should.equals('test@irgendwo.ch');
        resp[0].emailNormalized.should.equals('test@irgendwo.ch');
    });

    it('Invite already by other user invited person', async function () {
        dbDsl.invitationSentBeforeRegistration('4', [{
            emailOfUserToInvite: 'user10@irgendwo.ch'
        }]);
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/otherUser/invite', {
            emails: ['user10@IRGENDWo.ch']
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(invitedUser:InvitedUser)<-[:HAS_INVITED]-(user:User {userId: '1'})`)
            .where(`(invitedUser)<-[:SENDING_EMAIL_PENDING]-(user)`)
            .return("invitedUser.email AS email, invitedUser.emailNormalized AS emailNormalized")
            .orderBy("invitedUser.email DESC").end().send();
        resp.length.should.equals(1);
        resp[0].emailNormalized.should.equals('user10@irgendwo.ch');
    });

    it('Do not Invite already by user invited person', async function () {
        dbDsl.invitationSentBeforeRegistration('1', [{
            emailOfUserToInvite: 'user11@irgendwo.ch'
        }]);
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/otherUser/invite', {
            emails: ['uSER11@irgendwo.ch']
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(invitedUser:InvitedUser)<-[:HAS_INVITED]-(user:User {userId: '1'})`)
            .where(`(invitedUser)<-[:SENDING_EMAIL_PENDING]-(user)`)
            .return("invitedUser.email AS email, invitedUser.emailNormalized AS emailNormalized")
            .orderBy("invitedUser.email DESC").end().send();
        resp.length.should.equals(0);
    });

    it('Do not Invite existing user', async function () {
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/otherUser/invite', {
            emails: ['user2@irgendwo.ch']
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(invitedUser:InvitedUser)<-[:HAS_INVITED]-(user:User {userId: '1'})`)
            .return("invitedUser.email AS email, invitedUser.emailNormalized AS emailNormalized")
            .orderBy("invitedUser.email DESC").end().send();
        resp.length.should.equals(0);
    });

    it('Do not Invite unsubscribed person', async function () {
        dbDsl.invitationSentBeforeRegistration('1', [{
            emailOfUserToInvite: 'user30@irgendwo.ch'
        }]);
        dbDsl.disableEMailNotificationForInvitedUser('user30@irgendwo.ch');
        await dbDsl.sendToDb();

        await requestHandler.login(users.validUser);
        let res = await requestHandler.put('/api/user/otherUser/invite', {
            emails: ['user30@irgendwo.ch']
        });
        res.status.should.equal(200);

        let resp = await db.cypher().match(`(invitedUser:InvitedUser)<-[:HAS_INVITED]-(user:User {userId: '1'})`)
            .where(`(invitedUser)<-[:SENDING_EMAIL_PENDING]-(user)`)
            .return("invitedUser.email AS email, invitedUser.emailNormalized AS emailNormalized")
            .orderBy("invitedUser.email DESC").end().send();
        resp.length.should.equals(0);
    });
});
