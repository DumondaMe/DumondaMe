'use strict';

let testee = require('../../../../../../../models/eMailService/jobs/sendInviteEmailJob');
let email = require('elyoos-server-lib').eMail;
let db = require('elyoos-server-test-util').db;
let dbDsl = require('elyoos-server-test-util').dbDSL;
let sinon = require('sinon');
let expect = require('chai').expect;
let bluebird = require('bluebird');
let Promise = bluebird.Promise;
let cdn = require('elyoos-server-lib').cdn;
let fs = require('fs');

describe('Unit Test eMailService/jobs/sendInviteEmailJob', function () {

    let sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(function () {
        return dbDsl.init(6).then(function () {
            dbDsl.invitationSentBeforeRegistration('1', [{email: 'user8@irgendwo.ch', message: 'Elyoos ist super'}, {email: 'user9@irgendwo.ch'}, {email: 'user10@irgendwo.ch'},]);
            dbDsl.invitationSentBeforeRegistration('2', [{email: 'user20@irgendwo.ch'}, {email: 'user21@irgendwo.ch'}, {email: 'user220@irgendwo.ch'}]);
            return dbDsl.sendToDb();
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Send invite emails to all email addresses in the list, except to unsubscribed', function (done) {

        let finished, sendEMail = sandbox.stub(email, 'sendEMail'), cdnObjectData = 'test',
            cdnGetObject = sandbox.stub(cdn, 'getObject'), writeFileSync = sandbox.stub(fs, 'writeFileSync');
        sendEMail.returns(Promise.resolve());
        cdnGetObject.returns(cdnObjectData);

        finished = function () {
            expect(sendEMail.callCount).to.equals(3);
            expect(writeFileSync.calledOnce).to.equals(true);

            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1', userMessage: 'Elyoos ist super', userImage: sinon.match.any,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/user8@irgendwo.ch`},
                'user8@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1', userMessage: undefined, userImage: sinon.match.any,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/user9@irgendwo.ch`},
                'user9@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1', userMessage: undefined, userImage: sinon.match.any,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/user10@irgendwo.ch`},
                'user10@irgendwo.ch').calledOnce).to.equal(true);

            db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`)
                .where("user.invitationSent = true").return("user")
                .end().send().then(function (resp) {
                expect(resp.length).to.equal(3);
                done();
            });
        };
        testee.processDefinition({
            userId: '1',
            name: 'user Meier'
        }, finished);
    });

    it('Send invite emails to all email addresses in the list. Second failed to send', function (done) {

        let finished, sendEMail = sandbox.stub(email, 'sendEMail'), cdnObjectData = 'test',
            cdnGetObject = sandbox.stub(cdn, 'getObject');
        sandbox.stub(fs, 'writeFileSync');
        sendEMail.onCall(0).returns(Promise.resolve());
        sendEMail.onCall(1).returns(Promise.reject());
        sendEMail.returns(Promise.resolve());
        cdnGetObject.returns(cdnObjectData);

        finished = function () {
            expect(sendEMail.callCount).to.equals(3);

            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1', userMessage: 'Elyoos ist super', userImage: sinon.match.any,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/user8@irgendwo.ch`},
                'user8@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1', userMessage: undefined, userImage: sinon.match.any,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/user9@irgendwo.ch`},
                'user9@irgendwo.ch').calledOnce).to.equal(true);
            expect(sendEMail.withArgs('invitePerson', {name: 'user Meier', userId: '1', userMessage: undefined, userImage: sinon.match.any,
                    unsubscribeLink: `${process.env.ELYOOS_DOMAIN}unsubscribe/invitation/user10@irgendwo.ch`},
                'user10@irgendwo.ch').calledOnce).to.equal(true);

            db.cypher().match(`(user:InvitedUser)<-[:HAS_INVITED]-(:User {userId: '1'})`)
                .where("user.invitationSent = true").return("user")
                .end().send().then(function (resp) {
                expect(resp.length).to.equal(2);
                done();
            });
        };
        testee.processDefinition({
            userId: '1',
            name: 'user Meier'
        }, finished);
    });

    it('No invite email is sent because no request is pending', function (done) {

        let finished, sendEMail = sandbox.stub(email, 'sendEMail'), cdnObjectData = 'test',
            cdnGetObject = sandbox.stub(cdn, 'getObject'), writeFileSync = sandbox.stub(fs, 'writeFileSync');
        sendEMail.returns(Promise.resolve());
        cdnGetObject.returns(cdnObjectData);

        finished = function () {
            expect(sendEMail.callCount).to.equals(0);
            expect(writeFileSync.calledOnce).to.equals(false);
            done();
        };
        testee.processDefinition({
            userId: '3',
            name: 'user Meier'
        }, finished);
    });
});
