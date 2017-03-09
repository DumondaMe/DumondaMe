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
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        return requestHandler.logout();
    });

    it('Invite only user without a profile on elyoos - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/contact/invite',
                {
                    emails: ['user2@irgendwo.ch',
                        'user5@irgendwo.ch',
                        'user8@irgendwo.ch',
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

    it('Invite all users to elyoos - Return a 200', function () {
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

    it('No invitation is send because all users on elyoos - Return a 200', function () {
        return requestHandler.login(users.validUser).then(function (agent) {
            return requestHandler.post('/api/user/contact/invite',
                {
                    emails: ['user2@irgendwo.ch',
                        'user5@irgendwo.ch',
                        'user6@irgendwo.ch']
                }, agent);
        }).then(function (res) {
            res.status.should.equal(200);

            expect(stubEmailQueue.createImmediatelyJob.called).to.equal(false);
            return db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`).return("user.email AS email")
                .end().send();
        }).then(function (resp) {
            expect(resp.length).to.equal(0);
        });
    });
});
