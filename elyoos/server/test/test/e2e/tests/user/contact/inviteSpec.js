'use strict';

let users = require('elyoos-server-test-util').user;
let stubEmailQueue = require('elyoos-server-test-util').stubEmailQueue();
let requestHandler = require('elyoos-server-test-util').requestHandler;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let expect = require('chai').expect;

describe('Integration Tests for inviting other users to elyoos', function () {

    beforeEach(function () {

        return dbDsl.init(6).then(function () {
            stubEmailQueue.createImmediatelyJob.reset();
            dbDsl.invitationSentBeforeRegistration('4', [{email: 'user10@irgendwo.ch', invitationSent: 500}]);
            dbDsl.createContactConnection('1', '5');

            dbDsl.invitationSentBeforeRegistration('3', [{email: 'user10@irgendwo.ch', invitationSent: 500}]);
            dbDsl.unsubscribeInvitation('user30@irgendwo.ch');
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Invite only user without a profile on elyoos or without a contact connection', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/contact/invite',
                {
                    emails: ['user2@irgendwo.ch',
                        'user5@irgendwo.ch',
                        'user8@irgendwo.ch',
                        'user9@irgendwo.ch',
                        'user10@irgendwo.ch',
                        'user30@irgendwo.ch'],
                    message: "Elyoos ist super!"
                }, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            let argument = stubEmailQueue.createImmediatelyJob.getCall(0).args[1],
                sendCommand = stubEmailQueue.createImmediatelyJob.getCall(0).args[0];
            expect(sendCommand).to.equal('sendInviteEmail');
            expect(argument.userId).to.equal('1');

            return db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`)
                .return("user.email AS email, user.message AS message")
                .orderBy("user.email DESC").end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(3);
            expect(resp[0].email).to.equal('user9@irgendwo.ch');
            expect(resp[0].message).to.equal('Elyoos ist super!');
            expect(resp[1].email).to.equal('user8@irgendwo.ch');
            expect(resp[1].message).to.equal('Elyoos ist super!');
            expect(resp[2].email).to.equal('user10@irgendwo.ch');
            expect(resp[2].message).to.equal('Elyoos ist super!');
            return db.cypher().match(`(user:User {userId: '2'})<-[:HAS_INVITED]-(:User {userId: '1'})`).return("user")
                .orderBy("user.email DESC").end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(1);
        });
    });

    it('Invite only user with existing account on elyoos', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/contact/invite',
                {
                    emails: ['user2@irgendwo.ch',
                        'user4@irgendwo.ch',
                        'user5@irgendwo.ch']
                }, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            expect(stubEmailQueue.createImmediatelyJob.called).to.equal(false);

            return db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`)
                .return("user").end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(0);
            return db.cypher().match(`(user:User )<-[:HAS_INVITED]-(:User {userId: '1'})`).return("user")
                .orderBy("user.userId DESC").end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(2);
            expect(resp[0].user.userId).to.equal('4');
            expect(resp[0].user.email).to.equal('user4@irgendwo.ch');
            expect(resp[1].user.userId).to.equal('2');
            expect(resp[1].user.email).to.equal('user2@irgendwo.ch');
        });
    });

    it('Invite all not existing users to elyoos', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/contact/invite',
                {
                    emails: ['user8@irgendwo.ch',
                        'user9@irgendwo.ch',
                        'user10@irgendwo.ch']
                }, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            let argument = stubEmailQueue.createImmediatelyJob.getCall(0).args[1],
                sendCommand = stubEmailQueue.createImmediatelyJob.getCall(0).args[0];
            expect(sendCommand).to.equal('sendInviteEmail');
            expect(argument.userId).to.equal('1');
            return db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`).return("user.email AS email")
                .orderBy("user.email DESC").end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(3);
            expect(resp[0].email).to.equal('user9@irgendwo.ch');
            expect(resp[1].email).to.equal('user8@irgendwo.ch');
            expect(resp[2].email).to.equal('user10@irgendwo.ch');
        });
    });

    it('Invite no user', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/contact/invite',
                {
                    emails: ['user5@irgendwo.ch']
                }, agent);
        }).then(function (res) {
            res.status.should.equal(200);
            expect(stubEmailQueue.createImmediatelyJob.called).to.equal(false);
            return db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`).return("user.email AS email")
                .orderBy("user.email DESC").end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(0);
            return db.cypher().match(`(user:User )<-[:HAS_INVITED]-(:User {userId: '1'})`).return("user")
                .orderBy("user.userId DESC").end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(0);
        });
    });
});
